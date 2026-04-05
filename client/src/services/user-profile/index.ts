import { BACKEND_URL } from '../../helpers/constants';

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

export type CreateUserProfileDto = {
    gender: 'male' | 'female';
    weight_kg: number;
    height_cm: number;
    waist_cm: number;
    neck_cm: number;
    hip_cm: number;
    date_of_birth: string;
    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
    activity_goal: 'cut' | 'maintain' | 'bulk';
    training_goal: 'strength' | 'hypertrophy' | 'endurance';
};

const addUserProfile = async (token: string, dto: CreateUserProfileDto) => {
    const response = await fetch(BACKEND_URL + '/user-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    })

    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
}

const getUserProfile = async (token: string) => {
    const response = await fetch(BACKEND_URL + '/user-profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
    return response.json();
};

const updateUserProfile = async (token: string, dto: Partial<CreateUserProfileDto>) => {
    const response = await fetch(BACKEND_URL + '/user-profile', {
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

const deleteUserProfile = async (token: string) => {
    const response = await fetch(BACKEND_URL + '/user-profile', {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error(await getErrorMessageFromResponse(response));
};

export { addUserProfile, getUserProfile, updateUserProfile, deleteUserProfile };