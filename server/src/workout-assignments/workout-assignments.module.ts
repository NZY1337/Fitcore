import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutAssignment } from './entities/workout-assignment.entity';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { WorkoutAssignmentsController } from './workout-assignments.controller';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([WorkoutAssignment])],
    controllers: [WorkoutAssignmentsController],
    providers: [WorkoutAssignmentsService, SupabaseAuthGuard],
    exports: [WorkoutAssignmentsService],
})
export class WorkoutAssignmentsModule {}
