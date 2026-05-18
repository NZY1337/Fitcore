import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

type AuthReq = { user: { id: string } };

@Controller('workout-assignments')
@UseGuards(SupabaseAuthGuard)
export class WorkoutAssignmentsController {
    constructor(private readonly service: WorkoutAssignmentsService) {}

    @Get('mine')
    getMyAssignments(@Req() req: AuthReq) {
        return this.service.findByUser(req.user.id);
    }
}
