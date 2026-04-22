import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nutrition_logs')
export class NutritionLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    food_item: string;

    @Column({ type: 'text', nullable: true })
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;

    @Column({ type: 'double precision' })
    calories: number;

    @Column({ type: 'double precision', default: 0 })
    protein_g: number;

    @Column({ type: 'double precision', default: 0 })
    carbs_g: number;

    @Column({ type: 'double precision', default: 0 })
    fat_g: number;

    @Column({ type: 'double precision', nullable: true })
    serving_g: number | null;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @CreateDateColumn()
    logged_at: Date;
}
