import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TrainingGoalSettingsDto } from './training-goal-settings.dto';

export class UpdateSettingsDto {
    @ValidateNested()
    @Type(() => TrainingGoalSettingsDto)
    strength: TrainingGoalSettingsDto;

    @ValidateNested()
    @Type(() => TrainingGoalSettingsDto)
    hypertrophy: TrainingGoalSettingsDto;

    @ValidateNested()
    @Type(() => TrainingGoalSettingsDto)
    endurance: TrainingGoalSettingsDto;
}