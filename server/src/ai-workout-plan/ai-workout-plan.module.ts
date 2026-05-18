import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiWorkoutPlanController } from './ai-workout-plan.controller';
import { AiWorkoutPlanService } from './ai-workout-plan.service';
import { AiWorkoutPlan } from './entities/ai-workout-plan.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { WorkoutAssignment } from '../workout-assignments/entities/workout-assignment.entity';
import { ExercisesModule } from '../exercises/exercises.module';
import { AiUsageLogsModule } from '../ai-usage-logs/ai-usage-logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AiWorkoutPlan, UserProfile, WorkoutAssignment]),
        ExercisesModule,
        AiUsageLogsModule,
    ],
    controllers: [AiWorkoutPlanController],
    providers: [AiWorkoutPlanService],
})
export class AiWorkoutPlanModule {}
