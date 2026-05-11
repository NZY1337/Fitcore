import { Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, AfterInsert, Entity } from "typeorm";
import { Plan } from "../../utils/constants";

@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'enum', enum: Plan, default: Plan.FREE })
    plan: Plan;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterInsert()
    logInsert() {
        console.log('User created, id: ', this.id);
    }
}
