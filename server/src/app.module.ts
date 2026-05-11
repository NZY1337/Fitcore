import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfileModule } from './user-profile/user-profile.module';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { FitnessMetricsModule } from './fitness-metrics/fitness-metrics.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { SettingsModule } from './settings/settings.module';
import { WeightLogsModule } from './weight-logs/weight-logs.module';
import { NutritionLogsModule } from './nutrition-logs/nutrition-logs.module';
import { UserModule } from './user/user.module';

// interceptoirs
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserSyncInterceptor } from './interceptors/user-sync.interceptor';

// entities
import { UserEntity } from './user/entities/user.entity';
import { NutritionLog } from './nutrition-logs/entities/nutrition-log.entity';
import { WeightLog } from './weight-logs/entities/weight-log.entity';
import { UserSettings } from './settings/entities/settings.entity';
import { WorkoutLog } from './workout-logs/entities/workout-log.entity';
import { UserProfile } from './user-profile/entities/user-profile.entity';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SupabaseModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.LOCAL_DB_URL,
            entities: [UserProfile, WorkoutLog, UserSettings, WeightLog, NutritionLog, UserEntity],
            synchronize: true,
        }),
        UserProfileModule,
        FitnessMetricsModule,
        WorkoutLogsModule,
        SettingsModule,
        WeightLogsModule,
        NutritionLogsModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService, {
        provide: APP_INTERCEPTOR,
        useClass: UserSyncInterceptor,
    }],
})
export class AppModule { }
