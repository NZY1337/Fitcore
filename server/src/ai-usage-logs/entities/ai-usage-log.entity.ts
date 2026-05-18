import { Column, CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('ai_usage_logs')
export class AiUsageLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'text' })
    user_id: string;

    @Column({ type: 'text' })
    model: string;

    @Column({ type: 'text' })
    type: 'meal_plan' | 'workout_plan';

    @Column({ type: 'int' })
    prompt_tokens: number;

    @Column({ type: 'int' })
    completion_tokens: number;

    @Column({ type: 'decimal', precision: 10, scale: 6 })
    cost_usd: number;

    @CreateDateColumn()
    created_at: Date;
}
