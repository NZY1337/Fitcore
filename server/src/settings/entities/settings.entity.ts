import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import type { TrainingGoalSettings } from '../settings.types';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('user_settings')
export class UserSettings {
    @PrimaryColumn({ type: 'uuid' })
    user_id: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'jsonb' })
    strength: TrainingGoalSettings;

    @Column({ type: 'jsonb' })
    hypertrophy: TrainingGoalSettings;

    @Column({ type: 'jsonb' })
    endurance: TrainingGoalSettings;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}