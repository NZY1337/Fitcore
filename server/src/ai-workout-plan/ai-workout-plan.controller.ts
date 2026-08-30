import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiWorkoutPlanService } from './ai-workout-plan.service';
import { GeneratePlanDto, SelectPlanDto } from './dto/ai-workout-plan.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('ai-workout-plan')
@UseGuards(SupabaseAuthGuard)
export class AiWorkoutPlanController {
    constructor(private readonly service: AiWorkoutPlanService) {}

    @Post('generate')
    generate(@Req() req: any, @Body() dto: GeneratePlanDto) {
        return this.service.generate(req.user.id, dto);
    }

    @Post('select')
    selectVariant(@Req() req: any, @Body() dto: SelectPlanDto) {
        return this.service.selectVariant(req.user.id, dto);
    }

    @Get('current')
    getCurrent(@Req() req: any) {
        return this.service.getCurrent(req.user.id);
    }
}
