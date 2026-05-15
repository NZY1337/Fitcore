import { BACKEND_URL } from '../../helpers/constants';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WorkoutAssignment {
    id: string;
    user_id: string;
    exercise_id: string;
    name: string;
    body_part: string;
    equipment: string;
    notes: string | null;
    day_of_week: DayOfWeek | null;
    sets: number | null;
    reps: number | null;
    weight_kg: number | null;
    order: number;
    created_at: string;
}

export interface CreateAssignmentDto {
    user_id: string;
    exercise_id: string;
    name: string;
    body_part: string;
    equipment: string;
    notes?: string;
    day_of_week?: DayOfWeek;
    sets?: number;
    reps?: number;
    weight_kg?: number;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

const getError = async (res: Response): Promise<string> => {
    try {
        const data = await res.json();
        if (typeof data?.message === 'string') return data.message;
    } catch { /* fall through */ }
    return res.statusText || 'Request failed';
};

export const getMyAssignments = async (token: string): Promise<WorkoutAssignment[]> => {
    const res = await fetch(`${BACKEND_URL}/workout-assignments/mine`, { headers: auth(token) });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const getAdminUserAssignments = async (token: string, userId: string): Promise<WorkoutAssignment[]> => {
    const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/assignments`, { headers: auth(token) });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const createAssignment = async (token: string, dto: CreateAssignmentDto): Promise<WorkoutAssignment> => {
    const res = await fetch(`${BACKEND_URL}/admin/assignments`, {
        method: 'POST',
        headers: { ...auth(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await getError(res));
    return res.json();
};

export const deleteAssignment = async (token: string, id: string): Promise<void> => {
    const res = await fetch(`${BACKEND_URL}/admin/assignments/${id}`, {
        method: 'DELETE',
        headers: auth(token),
    });
    if (!res.ok) throw new Error(await getError(res));
};
