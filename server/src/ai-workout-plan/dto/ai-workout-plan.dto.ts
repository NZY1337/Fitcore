import { IsArray, IsIn, IsInt, IsString, Max, Min } from 'class-validator';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export class GeneratePlanDto {
    @IsArray()
    @IsString({ each: true })
    @IsIn(DAYS, { each: true })
    days_available: string[];

    @IsInt()
    @Min(20)
    @Max(180)
    session_duration: number;
}

export class SelectPlanDto {
    @IsString()
    plan_id: string;

    @IsInt()
    @Min(0)
    @Max(2)
    variant_index: number;
}
