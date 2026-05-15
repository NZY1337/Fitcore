import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../utils/constants';
import { UserService } from '../user/user.service';
import { WorkoutAssignmentsService } from '../workout-assignments/workout-assignments.service';
import { WorkoutAssignment } from '../workout-assignments/entities/workout-assignment.entity';
import { CreateAssignmentDto } from '../workout-assignments/dto/workout-assignment.dto';

@Controller('admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly assignmentsService: WorkoutAssignmentsService,
        @InjectRepository(WorkoutAssignment) private readonly assignmentRepo: Repository<WorkoutAssignment>,
    ) {}

    @Get('stats')
    async getStats() {
        const [userStats, totalAssignments, usersWithPlan, topExercises] = await Promise.all([
            this.userService.getStats(),
            this.assignmentRepo.count(),
            this.assignmentRepo
                .createQueryBuilder('a')
                .select('COUNT(DISTINCT a.user_id)', 'count')
                .getRawOne<{ count: string }>()
                .then(r => parseInt(r?.count ?? '0', 10)),
            this.assignmentRepo
                .createQueryBuilder('a')
                .select('a.name', 'name')
                .addSelect('COUNT(*)', 'count')
                .groupBy('a.name')
                .orderBy('count', 'DESC')
                .limit(5)
                .getRawMany<{ name: string; count: string }>(),
        ]);

        return {
            ...userStats,
            totalAssignments,
            usersWithPlan,
            topExercises: topExercises.map(e => ({ name: e.name, count: parseInt(e.count, 10) })),
        };
    }

    @Get('users')
    getUsers() {
        return this.userService.findAll();
    }

    @Patch('users/:id/role')
    updateRole(@Param('id') id: string, @Body('role') role: Role) {
        return this.userService.updateRole(id, role);
    }

    @Get('users/:id/assignments')
    getUserAssignments(@Param('id') id: string) {
        return this.assignmentsService.findByUser(id);
    }

    @Post('assignments')
    createAssignment(@Body() dto: CreateAssignmentDto) {
        return this.assignmentsService.create(dto);
    }

    @Delete('assignments/:id')
    removeAssignment(@Param('id') id: string) {
        return this.assignmentsService.remove(id);
    }
}
