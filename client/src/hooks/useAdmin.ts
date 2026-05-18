import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getAdminUsers, getAdminStats, updateUserRole, getAiUsage } from '../services/admin';

export const useAdmin = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: users = [], isPending, error } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getAdminUsers(token);
        },
        enabled: !!token,
        retry: false,
    });

    const roleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string; role: 'user' | 'admin' }) => {
            if (!token) throw new Error('No authentication token');
            return updateUserRole(token, id, role);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
    });

    return {
        users,
        isPending,
        error,
        isUpdating: roleMutation.isPending,
        changeRole: roleMutation.mutate,
    };
};

export const useAdminStats = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: stats, isPending } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getAdminStats(token);
        },
        enabled: !!token,
        staleTime: 60 * 1000,
    });

    return { stats, isPending };
};

export const useAiUsageLogs = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: logs = [], isPending } = useQuery({
        queryKey: ['aiUsageLogs'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getAiUsage(token);
        },
        enabled: !!token,
        staleTime: 60 * 1000,
    });

    return { logs, isPending };
};
