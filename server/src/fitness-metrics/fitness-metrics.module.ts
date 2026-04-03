import { Module } from '@nestjs/common';
import { FitnessMetricsController } from './fitness-metrics.controller';
import { FitnessMetricsService } from './fitness-metrics.service';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Module({
  imports: [UserProfileModule],
  controllers: [FitnessMetricsController],
  providers: [FitnessMetricsService, SupabaseAuthGuard],
})

export class FitnessMetricsModule { }
