import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserProfile } from './user-profile/entities/user-profile.entity';

import { FitnessMetricsModule } from './fitness-metrics/fitness-metrics.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { WorkoutLog } from './workout-logs/entities/workout-log.entity';
import { SettingsModule } from './settings/settings.module';
import { UserSettings } from './settings/entities/settings.entity';
import { WeightLogsModule } from './weight-logs/weight-logs.module';
import { WeightLog } from './weight-logs/entities/weight-log.entity';
import { NutritionLogsModule } from './nutrition-logs/nutrition-logs.module';
import { NutritionLog } from './nutrition-logs/entities/nutrition-log.entity';

// services
import { SupabaseModule } from '../services/supabase/supabase.module';
import { NodemailerModule } from '../services/nodemailer/nodemailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskServiceModule } from '../services/taskservice/taskservice.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.LOCAL_DB_URL,
            entities: [UserProfile, WorkoutLog, UserSettings, WeightLog, NutritionLog],
            synchronize: true,
        }),
        SupabaseModule,
        NodemailerModule,
        TaskServiceModule,
        UserProfileModule,
        FitnessMetricsModule,
        WorkoutLogsModule,
        SettingsModule,
        WeightLogsModule,
        NutritionLogsModule,
    ],
})
export class AppModule { }
