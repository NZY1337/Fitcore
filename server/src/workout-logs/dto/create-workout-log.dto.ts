import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber } from 'class-validator';

export class CreateWorkoutLogDto {
    @IsString()
    @IsNotEmpty()
    exercise: string;

    @IsInt()
    @IsPositive()
    sets: number;

    @IsInt()
    @IsPositive()
    reps: number;

    @IsNumber()
    @IsPositive()
    weight_kg: number;
}