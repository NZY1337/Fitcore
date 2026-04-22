import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    getNutritionLogs,
    createNutritionLog,
    updateNutritionLog,
    deleteNutritionLog,
    type CreateNutritionLogDto,
    type UpdateNutritionLogDto,
} from '../services/nutrition-logs';

export const useNutritionLogs = (date?: string) => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: nutritionLogs = [], isPending, error } = useQuery({
        queryKey: ['nutritionLogs', token, date],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getNutritionLogs(token, date);
        },
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateNutritionLogDto) => {
            if (!token) throw new Error('No authentication token');
            return createNutritionLog(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionLogs', token] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateNutritionLogDto }) => {
            if (!token) throw new Error('No authentication token');
            return updateNutritionLog(token, id, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionLogs', token] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No authentication token');
            return deleteNutritionLog(token, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionLogs', token] });
        },
    });

    return {
        nutritionLogs,
        isPending,
        error,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        addNutritionLog: createMutation.mutate,
        updateNutritionLog: updateMutation.mutate,
        removeNutritionLog: deleteMutation.mutate,
    };
};
