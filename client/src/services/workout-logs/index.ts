import { BACKEND_URL } from '../../helpers/constants';

export type CreateWorkoutLogDto = {
    exercise: string;
    sets: number;
    reps: number;
    weight_kg: number;
};

export type WorkoutLog = {
    id: string;
    exercise: string;
    sets: number;
    reps: number;
    weight_kg: number;
    oneRepMax: number;
    volume: number;
    workingWeight?: number;
    created_at: string;
    updated_at: string;
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

export const createWorkoutLog = async (token: string, dto: CreateWorkoutLogDto): Promise<WorkoutLog> => {
    const response = await fetch(BACKEND_URL + '/workout-logs', {
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

export const getWorkoutLogs = async (token: string, trainingGoal?: string): Promise<WorkoutLog[]> => {
    const url = new URL(BACKEND_URL + '/workout-logs');
    if (trainingGoal) url.searchParams.set('trainingGoal', trainingGoal);

    const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const deleteWorkoutLog = async (token: string, id: string): Promise<void> => {
    const response = await fetch(BACKEND_URL + '/workout-logs/' + id, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
};
