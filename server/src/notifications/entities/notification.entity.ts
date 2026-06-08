import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Entity } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'text' })
    type: 'info' | 'warning' | 'error';

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn()
    created_at: Date;
}
