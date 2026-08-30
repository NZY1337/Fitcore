import { BACKEND_URL } from '../../helpers/constants';

export interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    target: string;
    equipment: string;
    gifUrl: string;
    difficulty?: string;
    instructions?: string[];
    secondaryMuscles?: string[];
}

export interface PaginatedExercises {
    total: number;
    data: Exercise[];
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

const handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? res.statusText ?? 'Request failed');
    }
    return res.json();
};

export const getExercises = (
    token: string,
    params?: { q?: string; bodyPart?: string; equipment?: string; page?: number },
): Promise<PaginatedExercises> => {
    const url = new URL(BACKEND_URL + '/exercises');
    if (params?.q) url.searchParams.set('q', params.q);
    if (params?.bodyPart) url.searchParams.set('bodyPart', params.bodyPart);
    if (params?.equipment) url.searchParams.set('equipment', params.equipment);
    if (params?.page) url.searchParams.set('page', String(params.page));
    return fetch(url.toString(), { headers: authHeaders(token) }).then(handleResponse<PaginatedExercises>);
};

export const getExerciseById = (token: string, id: string): Promise<Exercise> =>
    fetch(BACKEND_URL + `/exercises/${id}`, { headers: authHeaders(token) }).then(handleResponse<Exercise>);

export const getSimilarExercises = (token: string, id: string): Promise<Exercise[]> =>
    fetch(BACKEND_URL + `/exercises/${id}/similar`, { headers: authHeaders(token) }).then(handleResponse<Exercise[]>);
