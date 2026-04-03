import {
    IsDateString,
    IsIn,
    IsNumber,
    IsPositive,
    IsString,
} from 'class-validator';
import { type TrainingGoalInput, type ActivityGoal, type ActivityLevel } from '../../utils/constants';

export class CreateUserProfileDto {
    @IsString()
    @IsIn(['male', 'female'])
    gender: 'male' | 'female';

    @IsNumber()
    @IsPositive()
    weight_kg: number;

    @IsNumber()
    @IsPositive()
    height_cm: number;

    @IsNumber()
    @IsPositive()
    waist_cm: number;

    @IsNumber()
    @IsPositive()
    neck_cm: number;

    @IsNumber()
    @IsPositive()
    hip_cm: number;

    @IsDateString()
    date_of_birth: string;

    @IsString()
    @IsIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'])
    activity_level: ActivityLevel;

    @IsString()
    @IsIn(['cut', 'maintain', 'bulk'])
    activity_goal: ActivityGoal;

    @IsString()
    @IsIn(['strength', 'hypertrophy', 'endurance'])
    training_goal: TrainingGoalInput;
}
