import { BACKEND_URL } from '../../helpers/constants';

export type WeightLog = {
    id: string;
    user_id: string;
    weight_kg: number;
    note: string | null;
    measured_at: string;
};

export type CreateWeightLogDto = {
    weight_kg: number;
    note?: string;
    measured_at?: string;
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

export const getWeightLogs = async (token: string): Promise<WeightLog[]> => {
    const response = await fetch(BACKEND_URL + '/weight-logs', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const createWeightLog = async (token: string, dto: CreateWeightLogDto): Promise<WeightLog> => {
    const response = await fetch(BACKEND_URL + '/weight-logs', {
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

export const deleteWeightLog = async (token: string, id: string): Promise<void> => {
    const response = await fetch(BACKEND_URL + '/weight-logs/' + id, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
};
