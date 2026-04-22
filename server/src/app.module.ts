import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserProfile } from './user-profile/entities/user-profile.entity';
import { SupabaseModule } from './supabase/supabase.module';
import { FitnessMetricsModule } from './fitness-metrics/fitness-metrics.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { WorkoutLog } from './workout-logs/entities/workout-log.entity';
import { SettingsModule } from './settings/settings.module';
import { UserSettings } from './settings/entities/settings.entity';
import { WeightLogsModule } from './weight-logs/weight-logs.module';
import { WeightLog } from './weight-logs/entities/weight-log.entity';
import { NutritionLogsModule } from './nutrition-logs/nutrition-logs.module';
import { NutritionLog } from './nutrition-logs/entities/nutrition-log.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SupabaseModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.LOCAL_DB_URL,
            entities: [UserProfile, WorkoutLog, UserSettings, WeightLog, NutritionLog],
            synchronize: true,
        }),
        UserProfileModule,
        FitnessMetricsModule,
        WorkoutLogsModule,
        SettingsModule,
        WeightLogsModule,
        NutritionLogsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
