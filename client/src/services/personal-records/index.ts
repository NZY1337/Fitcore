import { BACKEND_URL } from '../../helpers/constants';

export interface PersonalRecord {
    exercise: string;
    weight_kg: number;
    reps: number;
    sets: number;
    oneRepMax: number;
    achievedAt: string;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getPersonalRecords = async (token: string): Promise<PersonalRecord[]> => {
    const res = await fetch(`${BACKEND_URL}/workout-logs/personal-records`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch personal records');
    return res.json();
};

export const exportWorkoutCsv = async (token: string): Promise<void> => {
    const res = await fetch(`${BACKEND_URL}/workout-logs/export`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to export CSV');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
};
