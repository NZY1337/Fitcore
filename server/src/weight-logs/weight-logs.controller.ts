import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WeightLogsService } from './weight-logs.service';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';

@UseGuards(SupabaseAuthGuard)
@Controller('weight-logs')
export class WeightLogsController {
    constructor(private readonly weightLogsService: WeightLogsService) { }

    @Post()
    create(
        @Req() req: Request & { user: { id: string } },
        @Body() dto: CreateWeightLogDto,
    ) {
        return this.weightLogsService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Req() req: Request & { user: { id: string } }) {
        return this.weightLogsService.findAll(req.user.id);
    }

    @Delete(':id')
    remove(
        @Req() req: Request & { user: { id: string } },
        @Param('id') id: string,
    ) {
        return this.weightLogsService.remove(req.user.id, id);
    }
}
