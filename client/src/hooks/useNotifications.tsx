import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    subscribeToNotifications,
    type Notification,
} from '../services/notifications';

export const useNotifications = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications', token],
        queryFn: () => {
            if (!token) throw new Error('No token');
            return getNotifications(token);
        },
        enabled: !!token,
    });

    useEffect(() => {
        if (!token) return;
        const controller = new AbortController();
        subscribeToNotifications(
            token,
            (notification) => {
                queryClient.setQueryData<Notification[]>(
                    ['notifications', token],
                    (prev = []) => [notification, ...prev],
                );
            },
            controller.signal,
        );
        return () => controller.abort();
    }, [token, queryClient]);

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No token');
            return markNotificationAsRead(token, id);
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<Notification[]>(
                ['notifications', token],
                (prev = []) => prev.map(n => n.id === updated.id ? updated : n),
            );
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No token');
            return deleteNotification(token, id);
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData<Notification[]>(
                ['notifications', token],
                (prev = []) => prev.filter(n => n.id !== id),
            );
        },
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return {
        notifications,
        unreadCount,
        markAsRead: markAsReadMutation.mutate,
        remove: removeMutation.mutate,
    };
};
