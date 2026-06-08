import { Controller, Get, Post, Body, Req, Param, Delete, Patch, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Observable } from 'rxjs';

@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    create(@Req() req: Request & { user: { id: string } }, @Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(req.user.id, createNotificationDto);
    }

    @Sse('stream')
    stream(@Req() req: Request & { user: { id: string } }): Observable<MessageEvent> {
        return this.notificationsService.getStream(req.user.id);
    }

    @Get()
    findAll(@Req() req: Request & { user: { id: string } }) {
        return this.notificationsService.findAll(req.user.id);
    }

    @Patch(':id/read')
    markAsRead(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        return this.notificationsService.markAsRead(req.user.id, id);
    }

    @Delete(':id')
    remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        return this.notificationsService.remove(req.user.id, id);
    }
}
