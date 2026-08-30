import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { type TrainingGoalInput } from '../utils/constants';
import { calculateOneRepMax, calculateWorkingWeight, calculateVolume } from '../algorythm';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class WorkoutLogsService {
    constructor(
        @InjectRepository(WorkoutLog) private repo: Repository<WorkoutLog>,
        private readonly settingsService: SettingsService,
    ) { }

    create(userId: string, dto: CreateWorkoutLogDto): Promise<WorkoutLog> {
        const log = this.repo.create({ ...dto, user_id: userId });
        return this.repo.save(log);
    }

    async findAll(userId: string, trainingGoal?: TrainingGoalInput) {
        const logs = await this.repo.findBy({ user_id: userId });
        const trainingSettings = trainingGoal
            ? await this.settingsService.getTrainingGoalSettings(userId, trainingGoal)
            : undefined;

        try {
            return logs.map(log => {
                const oneRepMax = calculateOneRepMax(log.weight_kg, log.reps);
                const volume = calculateVolume({ sets: log.sets, reps: log.reps, weightKg: log.weight_kg });
                const workingWeight = trainingSettings
                    ? calculateWorkingWeight({ oneRepMax, multiplier: trainingSettings.workingWeightMultiplier })
                    : undefined;

                return { ...log, oneRepMax, volume, workingWeight };
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid workout log input';
            throw new BadRequestException(message);
        }
    }

    async remove(userId: string, logId: string): Promise<void> {
        const log = await this.repo.findOneBy({ id: logId, user_id: userId });
        if (!log) throw new NotFoundException('Workout log not found');
        await this.repo.remove(log);
    }

    async getPersonalRecords(userId: string) {
        const logs = await this.repo.findBy({ user_id: userId });
        const records = new Map<string, { exercise: string; weight_kg: number; reps: number; sets: number; oneRepMax: number; achievedAt: Date }>();

        for (const log of logs) {
            const oneRepMax = calculateOneRepMax(log.weight_kg, log.reps);
            const existing = records.get(log.exercise.toLowerCase());
            if (!existing || oneRepMax > existing.oneRepMax) {
                records.set(log.exercise.toLowerCase(), {
                    exercise: log.exercise,
                    weight_kg: log.weight_kg,
                    reps: log.reps,
                    sets: log.sets,
                    oneRepMax,
                    achievedAt: log.created_at,
                });
            }
        }

        return Array.from(records.values()).sort((a, b) => a.exercise.localeCompare(b.exercise));
    }

    async exportCsv(userId: string): Promise<string> {
        const logs = await this.repo.find({ where: { user_id: userId }, order: { created_at: 'ASC' } });
        const header = 'Date,Exercise,Sets,Reps,Weight (kg),Est. 1RM (kg),Volume (kg)';
        const rows = logs.map(log => {
            const oneRepMax = calculateOneRepMax(log.weight_kg, log.reps).toFixed(1);
            const volume = calculateVolume({ sets: log.sets, reps: log.reps, weightKg: log.weight_kg });
            const date = new Date(log.created_at).toISOString().slice(0, 10);
            return `${date},"${log.exercise}",${log.sets},${log.reps},${log.weight_kg},${oneRepMax},${volume}`;
        });
        return [header, ...rows].join('\n');
    }
}
