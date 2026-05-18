import { IsArray, IsIn, IsInt, IsString, Max, Min } from 'class-validator';

export class GenerateMealPlanDto {
    @IsArray()
    @IsString({ each: true })
    allergies: string[];

    @IsArray()
    @IsString({ each: true })
    avoid: string[];

    @IsString()
    @IsIn(['omnivore', 'vegetarian', 'vegan', 'pescatarian'])
    diet_type: string;

    @IsInt()
    @Min(3)
    @Max(6)
    meals_per_day: number;
}

export class SelectMealPlanDto {
    @IsString()
    plan_id: string;

    @IsInt()
    @Min(0)
    @Max(2)
    variant_index: number;
}
