import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightLog } from './entities/weight-log.entity';
import { WeightLogsController } from './weight-logs.controller';
import { WeightLogsService } from './weight-logs.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([WeightLog])],
    controllers: [WeightLogsController],
    providers: [WeightLogsService, SupabaseAuthGuard],
})
export class WeightLogsModule { }
