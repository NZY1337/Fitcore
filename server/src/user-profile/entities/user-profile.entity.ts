import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { type ActivityLevel, type ActivityGoal, type TrainingGoalInput } from '../../utils/constants';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryColumn()
    user_id: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'text' })
    gender: 'male' | 'female';

    @Column({ type: 'double precision' })
    weight_kg: number;

    @Column({ type: 'double precision' })
    height_cm: number;

    @Column({ type: 'double precision' })
    waist_cm: number;

    @Column({ type: 'double precision' })
    neck_cm: number;

    @Column({ type: 'double precision' })
    hip_cm: number;

    @Column({ type: 'date' })
    date_of_birth: Date;

    @Column({ type: 'text' })
    activity_level: ActivityLevel;

    @Column({ type: 'text' })
    activity_goal: ActivityGoal;

    @Column({ type: 'text' })
    training_goal: TrainingGoalInput;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id', this.user_id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed user with id', this.user_id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated user with id', this.user_id);
    }
}
