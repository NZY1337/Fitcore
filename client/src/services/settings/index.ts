import { BACKEND_URL } from '../../helpers/constants';

export type TrainingGoalKey = 'strength' | 'hypertrophy' | 'endurance';

export type TrainingGoalSettings = {
    workingWeightMultiplier: number;
    minReps: number;
    maxReps: number;
    minSets: number;
    maxSets: number;
    progressionIncrementKg: number;
    focus: string;
};

export type SettingsDto = {
    user_id: string;
    strength: TrainingGoalSettings;
    hypertrophy: TrainingGoalSettings;
    endurance: TrainingGoalSettings;
    created_at: string;
    updated_at: string;
};

export type UpdateSettingsDto = Pick<SettingsDto, 'strength' | 'hypertrophy' | 'endurance'>;

const getErrorMessageFromResponse = async (response: Response): Promise<string> => {
    try {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
            const data = await response.json();
            if (typeof data?.message === 'string') return data.message;
            if (Array.isArray(data?.message)) return data.message.join(', ');
            if (typeof data?.error === 'string') return data.error;
        }
    } catch {
        // Ignore parsing issues and fall back to status text.
    }

    return response.statusText || 'Request failed';
};

export const getSettings = async (token: string): Promise<SettingsDto> => {
    const response = await fetch(BACKEND_URL + '/settings', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export const updateSettings = async (token: string, dto: UpdateSettingsDto): Promise<SettingsDto> => {
    const response = await fetch(BACKEND_URL + '/settings', {
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