import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import type { TrainingGoalSettings } from '../settings.types';

@Entity('user_settings')
export class UserSettings {
    @PrimaryColumn({ type: 'uuid' })
    user_id: string;

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