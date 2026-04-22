import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@UseGuards(SupabaseAuthGuard)
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    findOne(@Req() req: Request & { user: { id: string } }) {
        return this.settingsService.findOne(req.user.id);
    }

    @Patch()
    update(@Req() req: Request & { user: { id: string } }, @Body() updateSettingsDto: UpdateSettingsDto) {
        return this.settingsService.update(req.user.id, updateSettingsDto);
    }
}