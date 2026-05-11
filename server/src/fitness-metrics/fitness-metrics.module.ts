import { Module } from '@nestjs/common';
import { FitnessMetricsController } from './fitness-metrics.controller';
import { FitnessMetricsService } from './fitness-metrics.service';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { NodemailerService } from '../../services/nodemailer/nodemailer.service';

@Module({
  imports: [UserProfileModule],
  controllers: [FitnessMetricsController],
  providers: [FitnessMetricsService, SupabaseAuthGuard, NodemailerService],
})

export class FitnessMetricsModule { }
