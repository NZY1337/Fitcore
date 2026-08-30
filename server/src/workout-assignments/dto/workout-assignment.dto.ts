import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, Min, IsUUID, IsIn } from 'class-validator';
import type { DayOfWeek } from '../entities/workout-assignment.entity';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export class CreateAssignmentDto {
    @IsUUID()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    exercise_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    body_part: string;

    @IsString()
    @IsNotEmpty()
    equipment: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsIn(DAYS)
    @IsOptional()
    day_of_week?: DayOfWeek;

    @IsInt()
    @Min(1)
    @IsOptional()
    sets?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    reps?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    weight_kg?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}
