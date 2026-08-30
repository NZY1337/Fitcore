import { BACKEND_URL } from '../../helpers/constants';

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

export interface AiMealPlan {
    id: string;
    user_id: string;
    preferences: { allergies: string[]; avoid: string[]; diet_type: string; meals_per_day: number };
    variants: MealPlanVariant[];
    selected_variant_index: number | null;
    is_activated: boolean;
    created_at: string;
}

export interface GenerateMealPlanDto {
    allergies: string[];
    avoid: string[];
    diet_type: string;
    meals_per_day: number;
}

export interface SelectMealPlanDto {
    plan_id: string;
    variant_index: number;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

const getError = async (res: Response): Promise<string> => {
    try {
        const d = await res.json();
        if (typeof d?.message === 'string') return d.message;
    } catch { /* fall through */ }
    return res.statusText || 'Request failed';
};

export const generateAiMealPlan = async (token: string, dto: GenerateMealPlanDto): Promise<AiMealPlan> => {
    const res = await fetch(`${BACKEND_URL}/ai-meal-plan/generate`, {
        method: 'POST',
        headers: { ...auth(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const selectAiMealPlanVariant = async (token: string, dto: SelectMealPlanDto): Promise<{ message: string }> => {
    const res = await fetch(`${BACKEND_URL}/ai-meal-plan/select`, {
        method: 'POST',
        headers: { ...auth(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const getCurrentAiMealPlan = async (token: string): Promise<AiMealPlan | null> => {
    const res = await fetch(`${BACKEND_URL}/ai-meal-plan/current`, { headers: auth(token) });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};
