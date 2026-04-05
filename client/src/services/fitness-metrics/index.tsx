// services/fitness-metrics/index.ts
import { BACKEND_URL } from '../../helpers/constants';

export type HeartRateZone = { min: number; max: number };

export type FitnessMetricsDto = {
    bmi: { bmi: number; category: 'underweight' | 'normal_weight' | 'overweight' | 'obesity' };
    bmr: number;
    tdee: number;
    caloriesTarget: number;
    macros: { protein: number; fat: number; carbs: number };
    bodyFat: number;
    heartRateZones: Record<'recovery' | 'fatBurn' | 'aerobic' | 'anaerobic' | 'maxEffort', HeartRateZone>;
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

const getFitnessMetrics = async (token: string): Promise<FitnessMetricsDto> => {
    const response = await fetch(BACKEND_URL + '/fitness-metrics', {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

export { getFitnessMetrics };