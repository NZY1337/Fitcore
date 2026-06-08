import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutAssignment } from './entities/workout-assignment.entity';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { WorkoutAssignmentsController } from './workout-assignments.controller';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([WorkoutAssignment]), UserModule],
    controllers: [WorkoutAssignmentsController],
    providers: [WorkoutAssignmentsService, SupabaseAuthGuard, RolesGuard],
    exports: [WorkoutAssignmentsService],
})
export class WorkoutAssignmentsModule {}
