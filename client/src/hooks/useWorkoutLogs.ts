import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    getWorkoutLogs,
    createWorkoutLog,
    deleteWorkoutLog,
    type CreateWorkoutLogDto,
} from '../services/workout-logs';
import { useUserProfile } from './useUserProfile';

export const useWorkoutLogs = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;
    const { userProfile } = useUserProfile();
    const trainingGoal = userProfile?.training_goal;

    const { data: workoutLogs = [], isPending, error } = useQuery({
        queryKey: ['workoutLogs', trainingGoal],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getWorkoutLogs(token, trainingGoal);
        },
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateWorkoutLogDto) => {
            if (!token) throw new Error('No authentication token');
            return createWorkoutLog(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No authentication token');
            return deleteWorkoutLog(token, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
        },
    });

    return {
        workoutLogs,
        isPending,
        error,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        addWorkoutLog: createMutation.mutate,
        removeWorkoutLog: deleteMutation.mutate,
    };
};
