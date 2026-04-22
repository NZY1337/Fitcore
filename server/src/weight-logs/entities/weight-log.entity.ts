import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('weight_logs')
export class WeightLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'double precision' })
    weight_kg: number;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @CreateDateColumn()
    measured_at: Date;
}
