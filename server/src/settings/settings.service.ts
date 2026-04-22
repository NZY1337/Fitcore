import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type TrainingGoalInput } from '../utils/constants';
import { DEFAULT_TRAINING_GUIDANCE_SETTINGS } from './default-settings';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UserSettings } from './entities/settings.entity';
import type { TrainingGoalSettings } from './settings.types';

@Injectable()
export class SettingsService {
    constructor(@InjectRepository(UserSettings) private readonly repo: Repository<UserSettings>) { }

    private buildDefaultSettings(userId: string): UserSettings {
        return this.repo.create({
            user_id: userId,
            strength: { ...DEFAULT_TRAINING_GUIDANCE_SETTINGS.strength },
            hypertrophy: { ...DEFAULT_TRAINING_GUIDANCE_SETTINGS.hypertrophy },
            endurance: { ...DEFAULT_TRAINING_GUIDANCE_SETTINGS.endurance },
        });
    }

    private validateGoalSettings(goal: TrainingGoalInput, settings: TrainingGoalSettings): void {
        if (settings.minReps > settings.maxReps) {
            throw new BadRequestException(`${goal} min reps cannot be greater than max reps.`);
        }

        if (settings.minSets > settings.maxSets) {
            throw new BadRequestException(`${goal} min sets cannot be greater than max sets.`);
        }
    }

    async findOne(userId: string): Promise<UserSettings> {
        const existing = await this.repo.findOneBy({ user_id: userId });

        if (existing) {
            return existing;
        }

        return this.repo.save(this.buildDefaultSettings(userId));
    }

    async update(userId: string, dto: UpdateSettingsDto): Promise<UserSettings> {
        const settings = await this.findOne(userId);

        this.validateGoalSettings('strength', dto.strength);
        this.validateGoalSettings('hypertrophy', dto.hypertrophy);
        this.validateGoalSettings('endurance', dto.endurance);

        const updatedSettings = this.repo.merge(settings, {
            strength: dto.strength,
            hypertrophy: dto.hypertrophy,
            endurance: dto.endurance,
        });

        return this.repo.save(updatedSettings);
    }

    async getTrainingGoalSettings(userId: string, trainingGoal: TrainingGoalInput): Promise<TrainingGoalSettings> {
        const settings = await this.findOne(userId);
        return settings[trainingGoal];
    }
}