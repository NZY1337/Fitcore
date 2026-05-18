import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiMealPlanController } from './ai-meal-plan.controller';
import { AiMealPlanService } from './ai-meal-plan.service';
import { AiMealPlan } from './entities/ai-meal-plan.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AiMealPlan, UserProfile])],
    controllers: [AiMealPlanController],
    providers: [AiMealPlanService],
})
export class AiMealPlanModule {}
