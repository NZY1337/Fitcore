import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    getWeightLogs,
    createWeightLog,
    deleteWeightLog,
    type CreateWeightLogDto,
} from '../services/weight-logs';

export const useWeightLogs = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: weightLogs = [], isPending, error } = useQuery({
        queryKey: ['weightLogs', token],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getWeightLogs(token);
        },
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateWeightLogDto) => {
            if (!token) throw new Error('No authentication token');
            return createWeightLog(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weightLogs', token] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No authentication token');
            return deleteWeightLog(token, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weightLogs', token] });
        },
    });

    return {
        weightLogs,
        isPending,
        error,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        addWeightLog: createMutation.mutate,
        removeWeightLog: deleteMutation.mutate,
    };
};
