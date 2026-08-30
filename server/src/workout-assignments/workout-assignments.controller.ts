import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { CreateAssignmentDto } from './dto/workout-assignment.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../utils/constants';

type AuthReq = { user: { id: string } };

@Controller('workout-assignments')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class WorkoutAssignmentsController {
    constructor(private readonly service: WorkoutAssignmentsService) {}

    @Get('mine')
    getMyAssignments(@Req() req: AuthReq) {
        return this.service.findByUser(req.user.id);
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() dto: CreateAssignmentDto) {
        return this.service.create(dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
