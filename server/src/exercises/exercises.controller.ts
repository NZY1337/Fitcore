import { Controller, Get, Param, Query, UseGuards, Res } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {}

    @Get()
    @UseGuards(SupabaseAuthGuard)
    getExercises(
        @Query('q') q?: string,
        @Query('bodyPart') bodyPart?: string,
        @Query('equipment') equipment?: string,
        @Query('page') page = '1',
    ) {
        const offset = (Math.max(1, parseInt(page, 10) || 1) - 1) * 10;

        if (q) return this.exercisesService.search(q, 10, offset);
        if (bodyPart) return this.exercisesService.getByBodyPart(bodyPart, 10, offset);
        if (equipment) return this.exercisesService.getByEquipment(equipment, 10, offset);
        return this.exercisesService.getAll(10, offset);
    }

    // Public — browsers cannot send auth headers via <img src>, API key is added server-side
    @Get('gif/:id')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getGif(@Param('id') id: string, @Res() res: any) {
        const buffer = await this.exercisesService.getGif(id);
        res.setHeader('Content-Type', 'image/gif');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
    }

    @Get(':id/similar')
    @UseGuards(SupabaseAuthGuard)
    getSimilar(@Param('id') id: string) {
        return this.exercisesService.getSimilar(id);
    }

    @Get(':id')
    @UseGuards(SupabaseAuthGuard)
    getById(@Param('id') id: string) {
        return this.exercisesService.getById(id);
    }
}
