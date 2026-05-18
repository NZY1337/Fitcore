import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutAssignment } from './entities/workout-assignment.entity';
import { CreateAssignmentDto } from './dto/workout-assignment.dto';

@Injectable()
export class WorkoutAssignmentsService {
    constructor(@InjectRepository(WorkoutAssignment) private readonly repo: Repository<WorkoutAssignment>) {}

    create(dto: CreateAssignmentDto): Promise<WorkoutAssignment> {
        return this.repo.count({ where: { user_id: dto.user_id } }).then(count => {
            const assignment = this.repo.create({
                user_id: dto.user_id,
                exercise_id: dto.exercise_id,
                name: dto.name,
                body_part: dto.body_part,
                equipment: dto.equipment,
                notes: dto.notes ?? null,
                day_of_week: dto.day_of_week ?? null,
                sets: dto.sets ?? null,
                reps: dto.reps ?? null,
                weight_kg: dto.weight_kg ?? null,
                order: dto.order ?? count,
            });
            return this.repo.save(assignment);
        });
    }

    findByUser(userId: string): Promise<WorkoutAssignment[]> {
        return this.repo.find({
            where: { user_id: userId },
            order: { day_of_week: 'ASC', order: 'ASC', created_at: 'ASC' },
        });
    }

    async remove(id: string): Promise<void> {
        const assignment = await this.repo.findOneBy({ id });
        if (!assignment) throw new NotFoundException('Assignment not found');
        await this.repo.remove(assignment);
    }
}
