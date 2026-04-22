import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionLog } from './entities/nutrition-log.entity';
import { NutritionLogsController } from './nutrition-logs.controller';
import { NutritionLogsService } from './nutrition-logs.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([NutritionLog])],
    controllers: [NutritionLogsController],
    providers: [NutritionLogsService, SupabaseAuthGuard],
})
export class NutritionLogsModule { }
