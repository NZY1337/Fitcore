import { Controller, Req, Get, UseGuards, Post, Body, Param, Delete, Query, Res } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { type TrainingGoalInput } from '../utils/constants';

@UseGuards(SupabaseAuthGuard)
@Controller('workout-logs')
export class WorkoutLogsController {
    constructor(private workoutLogsService: WorkoutLogsService) { }

    @Post()
    createWorkoutLog(@Req() req: Request & { user: { id: string } }, @Body() createWorkoutLogDto: CreateWorkoutLogDto) {
        return this.workoutLogsService.create(req.user.id, createWorkoutLogDto);
    }

    @Get()
    get(@Req() req: Request & { user: { id: string } }, @Query('trainingGoal') trainingGoal?: TrainingGoalInput) {
        return this.workoutLogsService.findAll(req.user.id, trainingGoal);
    }

    @Get('personal-records')
    getPersonalRecords(@Req() req: Request & { user: { id: string } }) {
        return this.workoutLogsService.getPersonalRecords(req.user.id);
    }

    @Get('export')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async exportCsv(@Req() req: Request & { user: { id: string } }, @Res() res: any) {
        const csv = await this.workoutLogsService.exportCsv(req.user.id);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="workout-logs.csv"');
        res.send(csv);
    }

    @Delete(':id')
    removeLog(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        return this.workoutLogsService.remove(req.user.id, id);
    }
}
