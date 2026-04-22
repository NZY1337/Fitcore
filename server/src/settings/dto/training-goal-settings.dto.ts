import { IsInt, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class TrainingGoalSettingsDto {
    @IsNumber()
    @IsPositive()
    workingWeightMultiplier: number;

    @IsInt()
    @Min(1)
    minReps: number;

    @IsInt()
    @Min(1)
    maxReps: number;

    @IsInt()
    @Min(1)
    minSets: number;

    @IsInt()
    @Min(1)
    maxSets: number;

    @IsNumber()
    @Min(0)
    progressionIncrementKg: number;

    @IsString()
    @MaxLength(300)
    focus: string;
}