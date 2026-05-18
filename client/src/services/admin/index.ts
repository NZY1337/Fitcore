import { BACKEND_URL } from '../../helpers/constants';

export interface AdminUser {
    id: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface AdminStats {
    totalUsers: number;
    adminCount: number;
    userCount: number;
    newLast7Days: number;
    newLast30Days: number;
    totalAssignments: number;
    usersWithPlan: number;
    topExercises: { name: string; count: number }[];
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

const getErrorMessage = async (res: Response): Promise<string> => {
    try {
        const ct = res.headers.get('content-type') ?? '';
        if (ct.includes('application/json')) {
            const data = await res.json();
            if (typeof data?.message === 'string') return data.message;
        }
    } catch { /* fall through */ }
    return res.statusText || 'Request failed';
};

export const getAdminStats = async (token: string): Promise<AdminStats> => {
    const res = await fetch(`${BACKEND_URL}/admin/stats`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
};

export const getAdminUsers = async (token: string): Promise<AdminUser[]> => {
    const res = await fetch(`${BACKEND_URL}/admin/users`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
};

export interface AiUsageStat {
    date: string;
    requests: string;
    prompt_tokens: string;
    completion_tokens: string;
    total_cost_usd: string;
}

export const getAiUsage = async (token: string): Promise<AiUsageStat[]> => {
    const res = await fetch(`${BACKEND_URL}/admin/ai-usage`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
};

export const updateUserRole = async (token: string, id: string, role: 'user' | 'admin'): Promise<AdminUser> => {
    const res = await fetch(`${BACKEND_URL}/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
};
