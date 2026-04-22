import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutLogsController } from './workout-logs.controller';
import { WorkoutLogsService } from './workout-logs.service';
import { WorkoutLog } from './entities/workout-log.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutLog]), SettingsModule],
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService, SupabaseAuthGuard],
})

export class WorkoutLogsModule { }
