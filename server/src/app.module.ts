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

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SupabaseModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.LOCAL_DB_URL,
            entities: [UserProfile, WorkoutLog],
            synchronize: true,
        }),
        UserProfileModule,
        FitnessMetricsModule,
        WorkoutLogsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
