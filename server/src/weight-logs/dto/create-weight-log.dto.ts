import { IsNumber, IsPositive, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateWeightLogDto {
    @IsNumber()
    @IsPositive()
    weight_kg: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsDateString()
    measured_at?: string;
}
