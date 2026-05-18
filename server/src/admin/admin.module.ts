import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { WorkoutAssignmentsModule } from '../workout-assignments/workout-assignments.module';
import { WorkoutAssignment } from '../workout-assignments/entities/workout-assignment.entity';
import { AiUsageLogsModule } from '../ai-usage-logs/ai-usage-logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkoutAssignment]),
        UserModule,
        WorkoutAssignmentsModule,
        AiUsageLogsModule,
    ],
    controllers: [AdminController],
})
export class AdminModule {}
