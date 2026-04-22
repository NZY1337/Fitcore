import {
    IsString,
    IsNumber,
    IsPositive,
    IsOptional,
    IsIn,
    IsDateString,
    Min,
} from 'class-validator';

export class UpdateNutritionLogDto {
    @IsOptional()
    @IsString()
    food_item?: string;

    @IsOptional()
    @IsIn(['breakfast', 'lunch', 'dinner', 'snack', null])
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    calories?: number;

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
