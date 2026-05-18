import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiMealPlanController } from './ai-meal-plan.controller';
import { AiMealPlanService } from './ai-meal-plan.service';
import { AiMealPlan } from './entities/ai-meal-plan.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { AiUsageLogsModule } from '../ai-usage-logs/ai-usage-logs.module';

@Module({
    imports: [TypeOrmModule.forFeature([AiMealPlan, UserProfile]), AiUsageLogsModule],
    controllers: [AiMealPlanController],
    providers: [AiMealPlanService],
})
export class AiMealPlanModule {}
