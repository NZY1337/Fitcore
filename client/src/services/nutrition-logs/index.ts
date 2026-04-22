import { BACKEND_URL } from '../../helpers/constants';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type NutritionLog = {
    id: string;
    user_id: string;
    food_item: string;
    meal_type: MealType | null;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    serving_g: number | null;
    note: string | null;
    logged_at: string;
};

export type CreateNutritionLogDto = {
    food_item: string;
    meal_type?: MealType;
    calories: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    serving_g?: number;
    note?: string;
    logged_at?: string;
};

export type UpdateNutritionLogDto = {
    food_item?: string;
    meal_type?: MealType | null;
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    serving_g?: number | null;
    note?: string | null;
    logged_at?: string;
};

const getErrorMessageFromResponse = async (response: Response): Promise<string> => {
    try {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
            const data = await response.json();
            if (typeof data?.message === 'string') return data.message;
            if (Array.isArray(data?.message)) return data.message.join(', ');
            if (typeof data?.error === 'string') return data.error;
        }
    } catch { /* fall through */ }
    return response.statusText || 'Request failed';
};

export const getNutritionLogs = async (token: string, date?: string): Promise<NutritionLog[]> => {
    const url = new URL(BACKEND_URL + '/nutrition-logs');
    if (date) url.searchParams.set('date', date);
    const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const createNutritionLog = async (
    token: string,
    dto: CreateNutritionLogDto,
): Promise<NutritionLog> => {
    const response = await fetch(BACKEND_URL + '/nutrition-logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const updateNutritionLog = async (
    token: string,
    id: string,
    dto: UpdateNutritionLogDto,
): Promise<NutritionLog> => {
    const response = await fetch(BACKEND_URL + '/nutrition-logs/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const deleteNutritionLog = async (token: string, id: string): Promise<void> => {
    const response = await fetch(BACKEND_URL + '/nutrition-logs/' + id, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
};
