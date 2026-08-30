import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { DayOfWeek } from '../../workout-assignments/entities/workout-assignment.entity';
import { UserEntity } from '../../user/entities/user.entity';

export interface PlanExercise {
    exercise_id: string;
    name: string;
    body_part: string;
    equipment: string;
    sets: number;
    reps: string;
    rest_seconds: number;
}

export interface PlanDay {
    day: DayOfWeek;
    focus: string;
    exercises: PlanExercise[];
}

export interface PlanVariant {
    name: string;
    description: string;
    split_type: string;
    days_per_week: number;
    schedule: PlanDay[];
}

@Entity('ai_workout_plans')
export class AiWorkoutPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'jsonb' })
    variants: PlanVariant[];

    @Column({ type: 'int', nullable: true })
    selected_variant_index: number | null;

    @Column({ default: false })
    is_activated: boolean;

    @CreateDateColumn()
    created_at: Date;
}
