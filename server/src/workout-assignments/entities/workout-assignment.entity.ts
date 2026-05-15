import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

@Entity('workout_assignments')
export class WorkoutAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    exercise_id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    body_part: string;

    @Column({ type: 'text' })
    equipment: string;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'text', nullable: true })
    day_of_week: DayOfWeek | null;

    @Column({ type: 'int', nullable: true })
    sets: number | null;

    @Column({ type: 'int', nullable: true })
    reps: number | null;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    weight_kg: number | null;

    @Column({ type: 'int', default: 0 })
    order: number;

    @CreateDateColumn()
    created_at: Date;
}
