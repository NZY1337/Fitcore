import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AiMealPlan, MealPlanVariant } from './entities/ai-meal-plan.entity';
import { GenerateMealPlanDto, SelectMealPlanDto } from './dto/ai-meal-plan.dto';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import {
    calculateBMR,
    calculateTDEE,
    calculateCaloriesTarget,
    calculateMacros,
} from '../algorythm';

@Injectable()
export class AiMealPlanService {
    private readonly logger = new Logger(AiMealPlanService.name);
    private readonly openai: OpenAI;

    constructor(
        @InjectRepository(AiMealPlan)
        private readonly planRepo: Repository<AiMealPlan>,
        @InjectRepository(UserProfile)
        private readonly profileRepo: Repository<UserProfile>,
        private readonly config: ConfigService,
    ) {
        this.openai = new OpenAI({
            apiKey: this.config.get<string>('OPENAI_API_KEY'),
            project: this.config.get<string>('OPENAI_PROJECT_ID'),
        });
    }

    async generate(userId: string, dto: GenerateMealPlanDto): Promise<AiMealPlan> {
        const profile = await this.profileRepo.findOne({ where: { user_id: userId } });
        if (!profile) throw new BadRequestException('Complete your user profile before generating a meal plan.');

        // Calculate macros using existing algorithms — AI does NOT calculate these
        const age = Math.floor(
            (Date.now() - new Date(profile.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
        );
        const bmr = calculateBMR({ weight: profile.weight_kg, height: profile.height_cm, gender: profile.gender, age });
        const tdee = calculateTDEE({ bmr, activityLevel: profile.activity_level });
        const caloriesTarget = calculateCaloriesTarget({ tdee, goal: profile.activity_goal });
        const macros = calculateMacros(caloriesTarget, profile.weight_kg);

        const targets = {
            calories: Math.round(caloriesTarget),
            protein: Math.round(macros.protein),
            carbs: Math.round(macros.carbs),
            fat: Math.round(macros.fat),
        };

        this.logger.log(`Generating meal plan for user ${userId} — targets: ${JSON.stringify(targets)}`);

        const prompt = this.buildPrompt(dto, targets, profile.training_goal);

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You are a professional nutritionist. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ],
        });

        const raw = completion.choices[0].message.content ?? '{}';
        let parsed: { variants: MealPlanVariant[] };

        try {
            parsed = JSON.parse(raw);
        } catch {
            throw new BadRequestException('AI returned an invalid response. Please try again.');
        }

        const plan = this.planRepo.create({
            user_id: userId,
            preferences: {
                allergies: dto.allergies,
                avoid: dto.avoid,
                diet_type: dto.diet_type,
                meals_per_day: dto.meals_per_day,
            },
            variants: parsed.variants ?? [],
            selected_variant_index: null,
            is_activated: false,
        });

        return this.planRepo.save(plan);
    }

    async selectVariant(userId: string, dto: SelectMealPlanDto): Promise<{ message: string }> {
        const plan = await this.planRepo.findOne({ where: { id: dto.plan_id, user_id: userId } });
        if (!plan) throw new NotFoundException('Meal plan not found.');
        
        if (dto.variant_index >= plan.variants.length) throw new BadRequestException('Invalid variant index.');

        plan.selected_variant_index = dto.variant_index;
        plan.is_activated = true;

        await this.planRepo.save(plan);

        return { message: 'Meal plan activated successfully.' };
    }

    async getCurrent(userId: string): Promise<AiMealPlan | null> {
        return this.planRepo.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    private buildPrompt(
        dto: GenerateMealPlanDto,
        targets: { calories: number; protein: number; carbs: number; fat: number },
        trainingGoal: string,
    ): string {
        const restrictionLines: string[] = [];
        if (dto.allergies.length > 0) restrictionLines.push(`- Allergii: ${dto.allergies.join(', ')}`);
        if (dto.avoid.length > 0) restrictionLines.push(`- Evita: ${dto.avoid.join(', ')}`);
        if (dto.diet_type !== 'omnivore') restrictionLines.push(`- Dieta: ${dto.diet_type}`);

        const n = dto.meals_per_day;
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'snack', 'snack'].slice(0, n);

        // Distribute macros per meal proportionally
        const weights = mealTypes.map(t => t === 'snack' ? 0.5 : 1);
        const weightSum = weights.reduce((a, b) => a + b, 0);
        const perMeal = mealTypes.map((type, i) => ({
            type,
            calories: Math.round((weights[i] / weightSum) * targets.calories),
            protein: Math.round((weights[i] / weightSum) * targets.protein),
            carbs: Math.round((weights[i] / weightSum) * targets.carbs),
            fat: Math.round((weights[i] / weightSum) * targets.fat),
        }));

        const mealTargetsLines = perMeal
            .map((m, i) => `  Masa ${i + 1} (${m.type}): ${m.calories} kcal | P:${m.protein}g | C:${m.carbs}g | F:${m.fat}g`)
            .join('\n');

        return `Esti un nutritionist profesionist. Creeaza 3 variante diferite de plan alimentar zilnic.

TARGETURI NUTRITIONALE ZILNICE:
- Calorii totale: ${targets.calories} kcal
- Proteine totale: ${targets.protein}g
- Carbohidrati totali: ${targets.carbs}g
- Grasimi totale: ${targets.fat}g
- Obiectiv antrenament: ${trainingGoal}

DISTRIBUTIA CALORIILOR PE MESE (respecta exact aceste valori pentru fiecare masa):
${mealTargetsLines}

RESTRICTII ALIMENTARE:
${restrictionLines.length > 0 ? restrictionLines.join('\n') : '- Nicio restrictie'}

REGULI CRITICE:
1. Fiecare varianta trebuie sa aiba un stil diferit (ex: mediteranean, high-protein clasic, plant-based)
2. meal.totals pentru fiecare masa TREBUIE sa fie exact valorile din "DISTRIBUTIA CALORIILOR PE MESE" de mai sus.
3. Alimentele din fiecare masa trebuie alese astfel incat macros lor sa se adune la meal.totals.
4. Nu folosi alimente din lista de restrictii.
5. Fiecare masa sa aiba 2-5 alimente cu cantitati precise in grame/ml.
6. Fiecare masa trebuie sa aiba campul "instructions" cu 2-3 pasi scurti de preparare.

Returneaza DOAR acest JSON (fara markdown, fara explicatii):
{
  "variants": [
    {
      "name": "Nume scurt descriptiv",
      "description": "1-2 propozitii despre abordare si cui i se potriveste",
      "daily_targets": {
        "calories": ${targets.calories},
        "protein": ${targets.protein},
        "carbs": ${targets.carbs},
        "fat": ${targets.fat}
      },
      "meals": [
        {
          "meal_type": "breakfast",
          "name": "Denumire masa",
          "instructions": "Descriere scurta a modului de preparare in 2-3 pasi simpli.",
          "foods": [
            {
              "name": "Aliment",
              "amount": "150g",
              "calories": 250,
              "protein": 20,
              "carbs": 30,
              "fat": 5
            }
          ],
          "totals": {
            "calories": 250,
            "protein": 20,
            "carbs": 30,
            "fat": 5
          }
        }
      ]
    }
  ]
}`;
    }
}
