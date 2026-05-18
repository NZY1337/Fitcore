import { BACKEND_URL } from '../../helpers/constants';

export interface CurrentUser {
    id: string;
    email: string;
    role: 'user' | 'admin';
    plan: string;
    createdAt: string;
}

export const getCurrentUser = async (token: string): Promise<CurrentUser> => {
    const res = await fetch(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
};
