import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { type TrainingGoalInput } from '../utils/constants';
import { calculateOneRepMax, calculateWorkingWeight, calculateVolume } from '../algorythm';

@Injectable()
export class WorkoutLogsService {
    constructor(@InjectRepository(WorkoutLog) private repo: Repository<WorkoutLog>) { }

    create(userId: string, dto: CreateWorkoutLogDto): Promise<WorkoutLog> {
        const log = this.repo.create({ ...dto, user_id: userId });
        return this.repo.save(log);
    }

    async findAll(userId: string, trainingGoal?: TrainingGoalInput) {
        const logs = await this.repo.findBy({ user_id: userId });

        try {
            return logs.map(log => {
                const oneRepMax = calculateOneRepMax(log.weight_kg, log.reps);
                const volume = calculateVolume({ sets: log.sets, reps: log.reps, weightKg: log.weight_kg });
                const workingWeight = trainingGoal
                    ? calculateWorkingWeight({ oneRepMax, trainingGoal })
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
}
