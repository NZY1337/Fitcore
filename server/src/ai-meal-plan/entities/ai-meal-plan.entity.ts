import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealFood {
    name: string;
    amount: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface PlanMeal {
    meal_type: MealType;
    name: string;
    instructions: string;
    foods: MealFood[];
    totals: { calories: number; protein: number; carbs: number; fat: number };
}

export interface MealPlanVariant {
    name: string;
    description: string;
    daily_targets: { calories: number; protein: number; carbs: number; fat: number };
    meals: PlanMeal[];
}

export interface DietaryPreferences {
    allergies: string[];
    avoid: string[];
    diet_type: string;
    meals_per_day: number;
}

@Entity('ai_meal_plans')
export class AiMealPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'jsonb' })
    preferences: DietaryPreferences;

    @Column({ type: 'jsonb' })
    variants: MealPlanVariant[];

    @Column({ type: 'int', nullable: true })
    selected_variant_index: number | null;

    @Column({ default: false })
    is_activated: boolean;

    @CreateDateColumn()
    created_at: Date;
}
