import { PartialType, } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-user-profile.dto';
import {
    IsDateString,
    IsIn,
    IsNumber,
    IsPositive,
    IsString,
} from 'class-validator';
import { type ActivityGoal, type ActivityLevel, type TrainingGoalInput } from '../../utils/constants';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {
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
