import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsOptional,
    IsIn,
    IsDateString,
    Min,
} from 'class-validator';

export class CreateNutritionLogDto {
    @IsString()
    @IsNotEmpty()
    food_item: string;

    @IsOptional()
    @IsIn(['breakfast', 'lunch', 'dinner', 'snack'])
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';

    @IsNumber()
    @IsPositive()
    calories: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    protein_g?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    carbs_g?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    fat_g?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    serving_g?: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsDateString()
    logged_at?: string;
}
