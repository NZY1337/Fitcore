import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { SupabaseModule } from '../../services/supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
    controllers: [ExercisesController],
    providers: [ExercisesService],
})
export class ExercisesModule {}
