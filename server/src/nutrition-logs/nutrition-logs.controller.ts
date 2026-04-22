import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, Query } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { NutritionLogsService } from './nutrition-logs.service';
import { CreateNutritionLogDto } from './dto/create-nutrition-log.dto';
import { UpdateNutritionLogDto } from './dto/update-nutrition-log.dto';

@UseGuards(SupabaseAuthGuard)
@Controller('nutrition-logs')
export class NutritionLogsController {
    constructor(private readonly nutritionLogsService: NutritionLogsService) { }

    @Post()
    create(
        @Req() req: Request & { user: { id: string } },
        @Body() dto: CreateNutritionLogDto,
    ) {
        return this.nutritionLogsService.create(req.user.id, dto);
    }

    @Get()
    findAll(
        @Req() req: Request & { user: { id: string } },
        @Query('date') date?: string,
    ) {
        return this.nutritionLogsService.findAll(req.user.id, date);
    }

    @Patch(':id')
    update(
        @Req() req: Request & { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: UpdateNutritionLogDto,
    ) {
        return this.nutritionLogsService.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(
        @Req() req: Request & { user: { id: string } },
        @Param('id') id: string,
    ) {
        return this.nutritionLogsService.remove(req.user.id, id);
    }
}
