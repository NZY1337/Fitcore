import { BACKEND_URL } from '../../helpers/constants';

export type Notification = {
    id: string;
    user_id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    is_read: boolean;
    created_at: string;
};

export const getNotifications = async (token: string): Promise<Notification[]> => {
    const response = await fetch(BACKEND_URL + '/notifications', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
};

export const markNotificationAsRead = async (token: string, id: string): Promise<Notification> => {
    const response = await fetch(BACKEND_URL + `/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
};

export const deleteNotification = async (token: string, id: string): Promise<void> => {
    const response = await fetch(BACKEND_URL + `/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete notification');
};

export const subscribeToNotifications = (
    token: string,
    onNotification: (notification: Notification) => void,
    signal: AbortSignal,
) => {
    fetch(BACKEND_URL + '/notifications/stream', {
        headers: { Authorization: `Bearer ${token}` },
        signal,
    }).then(async (response) => {
        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split('\n\n');
            buffer = chunks.pop() ?? '';

            for (const chunk of chunks) {
                const dataLine = chunk.split('\n').find(l => l.startsWith('data:'));
                if (dataLine) {
                    try {
                        onNotification(JSON.parse(dataLine.slice(5).trim()));
                    } catch { /* ignore malformed */ }
                }
            }
        }
    }).catch(() => { /* aborted or network error */ });
};
