import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AiWorkoutPlan, PlanVariant, PlanExercise } from './entities/ai-workout-plan.entity';
import { GeneratePlanDto, SelectPlanDto } from './dto/ai-workout-plan.dto';
import { ExercisesService, Exercise } from '../exercises/exercises.service';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { WorkoutAssignment } from '../workout-assignments/entities/workout-assignment.entity';
import { AiUsageLogsService } from '../ai-usage-logs/ai-usage-logs.service';

const BODY_PARTS = ['chest', 'back', 'shoulders', 'upper arms', 'upper legs', 'lower legs', 'waist'];

@Injectable()
export class AiWorkoutPlanService {
    private readonly logger = new Logger(AiWorkoutPlanService.name);
    private readonly openai: OpenAI;

    constructor(
        @InjectRepository(AiWorkoutPlan)
        private readonly planRepo: Repository<AiWorkoutPlan>,
        @InjectRepository(UserProfile)
        private readonly profileRepo: Repository<UserProfile>,
        @InjectRepository(WorkoutAssignment)
        private readonly assignmentRepo: Repository<WorkoutAssignment>,
        private readonly exercisesService: ExercisesService,
        private readonly config: ConfigService,
        private readonly aiUsageLogs: AiUsageLogsService,
    ) {
        this.openai = new OpenAI({
            apiKey: this.config.get<string>('OPENAI_API_KEY'),
            project: this.config.get<string>('OPENAI_PROJECT_ID'),
        });
    }

    async generate(userId: string, dto: GeneratePlanDto): Promise<AiWorkoutPlan> {
        const profile = await this.profileRepo.findOne({ where: { user_id: userId } });
        if (!profile) throw new BadRequestException('Complete your user profile before generating a plan.');

        // Fetch exercises per body part in parallel, 12 per part
        const results = await Promise.all(
            BODY_PARTS.map(bp => this.exercisesService.getByBodyPart(bp, 12, 0).catch(() => ({ data: [] }))),
        );

        const allExercises: Exercise[] = [];
        const seen = new Set<string>();
        for (const r of results) {
            for (const ex of r.data) {
                if (!seen.has(ex.id)) {
                    seen.add(ex.id);
                    allExercises.push(ex);
                }
            }
        }

        if (allExercises.length === 0) throw new BadRequestException('Could not fetch exercises. Try again later.');

        const exerciseList = allExercises
            .map(e => `ID:${e.id} | ${e.name} | ${e.bodyPart} | ${e.equipment} | difficulty:${e.difficulty ?? 'N/A'}`)
            .join('\n');

        const prompt = this.buildPrompt(profile, dto, exerciseList);

        this.logger.log(`Generating AI plan for user ${userId} — ${allExercises.length} exercises provided`);

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert fitness coach. Always respond with valid JSON only.',
                },
                { role: 'user', content: prompt },
            ],
        });

        void this.aiUsageLogs.log({
            user_id: userId,
            model: completion.model,
            type: 'workout_plan',
            prompt_tokens: completion.usage?.prompt_tokens ?? 0,
            completion_tokens: completion.usage?.completion_tokens ?? 0,
        });

        const raw = completion.choices[0].message.content ?? '{}';
        let parsed: { variants: PlanVariant[] };

        try {
            parsed = JSON.parse(raw);
        } catch {
            throw new BadRequestException('AI returned an invalid response. Please try again.');
        }

        // Validate & enrich: ensure all exercise IDs exist in our fetched list
        const exerciseMap = new Map(allExercises.map(e => [e.id, e]));
        const validated = this.validateAndEnrich(parsed.variants ?? [], exerciseMap);

        const plan = this.planRepo.create({
            user_id: userId,
            variants: validated,
            selected_variant_index: null,
            is_activated: false,
        });

        return this.planRepo.save(plan);
    }

    async selectVariant(userId: string, dto: SelectPlanDto): Promise<{ message: string }> {
        const plan = await this.planRepo.findOne({ where: { id: dto.plan_id, user_id: userId } });
        if (!plan) throw new NotFoundException('Plan not found.');
        if (dto.variant_index >= plan.variants.length) throw new BadRequestException('Invalid variant index.');

        const variant = plan.variants[dto.variant_index];

        // Remove previous AI-generated assignments for this user
        await this.assignmentRepo.delete({ user_id: userId });

        // Insert new assignments from selected variant
        const assignments: Partial<WorkoutAssignment>[] = [];
        for (const day of variant.schedule) {
            day.exercises.forEach((ex, idx) => {
                const repsNum = parseInt(ex.reps.split('-')[0], 10) || 10;
                assignments.push({
                    user_id: userId,
                    exercise_id: ex.exercise_id,
                    name: ex.name,
                    body_part: ex.body_part,
                    equipment: ex.equipment,
                    day_of_week: day.day,
                    sets: ex.sets,
                    reps: repsNum,
                    notes: `Rest: ${ex.rest_seconds}s — ${variant.name}`,
                    order: idx,
                });
            });
        }

        await this.assignmentRepo.save(assignments);

        plan.selected_variant_index = dto.variant_index;
        plan.is_activated = true;
        await this.planRepo.save(plan);

        return { message: 'Plan activated successfully.' };
    }

    async getCurrent(userId: string): Promise<AiWorkoutPlan | null> {
        return this.planRepo.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private buildPrompt(profile: UserProfile, dto: GeneratePlanDto, exerciseList: string): string {
        const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
        const daysStr = dto.days_available.join(', ');

        return `Create 3 different weekly workout plans for this user.

USER PROFILE:
- Training goal: ${profile.training_goal} (strength=low reps/heavy | hypertrophy=moderate reps | endurance=high reps/light)
- Diet goal: ${profile.activity_goal}
- Activity level: ${profile.activity_level}
- Gender: ${profile.gender}
- Age: ~${age} years
- Available days: ${daysStr}
- Session duration: ${dto.session_duration} minutes

RULES:
1. Only schedule exercises on the user's available days: ${daysStr}
2. Each variant must use a different training split (e.g., Full Body, Upper-Lower, Push-Pull-Legs)
3. Only use exercise IDs from the AVAILABLE EXERCISES list below — never invent IDs
4. Adjust sets/reps to the training goal:
   - strength: 3-5 sets, 3-6 reps, 120-180s rest
   - hypertrophy: 3-4 sets, 8-12 reps, 60-90s rest
   - endurance: 3-4 sets, 15-20 reps, 30-60s rest
5. Fit ${dto.session_duration} min sessions (4-6 exercises per day max for short sessions, 6-8 for long)
6. Reps field must be a range string like "8-12"

AVAILABLE EXERCISES (use only these IDs):
${exerciseList}

Return ONLY this JSON structure (no markdown, no explanation):
{
  "variants": [
    {
      "name": "Short descriptive name",
      "description": "2-sentence description of the approach and who it suits",
      "split_type": "e.g. Full Body / Upper-Lower / Push-Pull-Legs",
      "days_per_week": 3,
      "schedule": [
        {
          "day": "monday",
          "focus": "e.g. Push — Chest, Shoulders, Triceps",
          "exercises": [
            {
              "exercise_id": "exact_id_from_list",
              "sets": 4,
              "reps": "8-12",
              "rest_seconds": 90
            }
          ]
        }
      ]
    }
  ]
}`;
    }

    private validateAndEnrich(
        variants: PlanVariant[],
        exerciseMap: Map<string, Exercise>,
    ): PlanVariant[] {
        return variants.map(variant => ({
            ...variant,
            schedule: (variant.schedule ?? []).map(day => ({
                ...day,
                exercises: (day.exercises ?? [])
                    .filter(ex => exerciseMap.has(ex.exercise_id))
                    .map(ex => {
                        const found = exerciseMap.get(ex.exercise_id)!;
                        return {
                            exercise_id: ex.exercise_id,
                            name: found.name,
                            body_part: found.bodyPart,
                            equipment: found.equipment,
                            sets: ex.sets,
                            reps: ex.reps,
                            rest_seconds: ex.rest_seconds,
                        } satisfies PlanExercise;
                    }),
            })).filter(day => day.exercises.length > 0),
        }));
    }
}
