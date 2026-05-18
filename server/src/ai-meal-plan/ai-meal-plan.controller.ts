import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiMealPlanService } from './ai-meal-plan.service';
import { GenerateMealPlanDto, SelectMealPlanDto } from './dto/ai-meal-plan.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('ai-meal-plan')
@UseGuards(SupabaseAuthGuard)
export class AiMealPlanController {
    constructor(private readonly service: AiMealPlanService) {}

    @Post('generate')
    generate(@Req() req: any, @Body() dto: GenerateMealPlanDto) {
        return this.service.generate(req.user.id, dto);
    }

    @Post('select')
    selectVariant(@Req() req: any, @Body() dto: SelectMealPlanDto) {
        return this.service.selectVariant(req.user.id, dto);
    }

    @Get('current')
    getCurrent(@Req() req: any) {
        return this.service.getCurrent(req.user.id);
    }
}
