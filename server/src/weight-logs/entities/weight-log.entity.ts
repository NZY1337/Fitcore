import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('weight_logs')
export class WeightLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'double precision' })
    weight_kg: number;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @CreateDateColumn()
    measured_at: Date;
}
