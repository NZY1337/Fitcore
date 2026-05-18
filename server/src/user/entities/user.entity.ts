import { Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, AfterInsert, Entity } from "typeorm";
import { Plan, Role } from "../../utils/constants";

@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column({ type: 'enum', enum: Plan, default: Plan.FREE })
    plan: Plan;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterInsert()
    logInsert() {
        console.log('User created, id: ', this.id);
    }
}
