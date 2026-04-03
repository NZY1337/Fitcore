import { UseGuards, Req, Get, Controller } from '@nestjs/common';
import { FitnessMetricsService } from './fitness-metrics.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('fitness-metrics')
export class FitnessMetricsController {
    constructor(private fitnessMetricsService: FitnessMetricsService) { }

    @Get()
    getMetrics(@Req() req: Request & { user: { id: string } }) {
        return this.fitnessMetricsService.getMetrics(req.user.id);
    }
}
