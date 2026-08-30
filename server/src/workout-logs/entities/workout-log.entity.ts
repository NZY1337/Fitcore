import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('workout_logs')
export class WorkoutLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    exercise: string;

    @Column({ type: 'integer' })
    sets: number;

    @Column({ type: 'integer' })
    reps: number;

    @Column({ type: 'double precision' })
    weight_kg: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @AfterInsert()
    logInsert() {
        console.log('Inserted workout log with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed workout log with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated workout log with id', this.id);
    }

}