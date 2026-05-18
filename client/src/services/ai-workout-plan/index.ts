import { BACKEND_URL } from '../../helpers/constants';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface PlanExercise {
    exercise_id: string;
    name: string;
    body_part: string;
    equipment: string;
    sets: number;
    reps: string;
    rest_seconds: number;
}

export interface PlanDay {
    day: DayOfWeek;
    focus: string;
    exercises: PlanExercise[];
}

export interface PlanVariant {
    name: string;
    description: string;
    split_type: string;
    days_per_week: number;
    schedule: PlanDay[];
}

export interface AiWorkoutPlan {
    id: string;
    user_id: string;
    variants: PlanVariant[];
    selected_variant_index: number | null;
    is_activated: boolean;
    created_at: string;
}

export interface GeneratePlanDto {
    days_available: DayOfWeek[];
    session_duration: number;
}

export interface SelectPlanDto {
    plan_id: string;
    variant_index: number;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

const getError = async (res: Response): Promise<string> => {
    try {
        const data = await res.json();
        if (typeof data?.message === 'string') return data.message;
    } catch { /* fall through */ }
    return res.statusText || 'Request failed';
};

export const generateAiPlan = async (token: string, dto: GeneratePlanDto): Promise<AiWorkoutPlan> => {
    const res = await fetch(`${BACKEND_URL}/ai-workout-plan/generate`, {
        method: 'POST',
        headers: { ...auth(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const selectAiPlanVariant = async (token: string, dto: SelectPlanDto): Promise<{ message: string }> => {
    const res = await fetch(`${BACKEND_URL}/ai-workout-plan/select`, {
        method: 'POST',
        headers: { ...auth(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const getCurrentAiPlan = async (token: string): Promise<AiWorkoutPlan | null> => {
    const res = await fetch(`${BACKEND_URL}/ai-workout-plan/current`, { headers: auth(token) });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};
