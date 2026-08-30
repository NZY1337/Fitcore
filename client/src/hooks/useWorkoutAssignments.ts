import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    getMyAssignments,
    getAdminUserAssignments,
    createAssignment,
    deleteAssignment,
    type CreateAssignmentDto,
} from '../services/workout-assignments';

export const useMyAssignments = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: assignments = [], isPending, error } = useQuery({
        queryKey: ['myAssignments'],
        queryFn: () => {
            if (!token) throw new Error('No token');
            return getMyAssignments(token);
        },
        enabled: !!token,
    });

    return { assignments, isPending, error };
};

export const useUserAssignments = (userId: string | null) => {
    const { session } = useAppContext();
    const token = session?.access_token;
    const queryClient = useQueryClient();

    const { data: assignments = [], isPending } = useQuery({
        queryKey: ['userAssignments', userId],
        queryFn: () => {
            if (!token || !userId) throw new Error('No token or userId');
            return getAdminUserAssignments(token, userId);
        },
        enabled: !!token && !!userId,
    });

    const addMutation = useMutation({
        mutationFn: (dto: CreateAssignmentDto) => {
            if (!token) throw new Error('No token');
            return createAssignment(token, dto);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userAssignments', userId] }),
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error('No token');
            return deleteAssignment(token, id);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userAssignments', userId] }),
    });

    return {
        assignments,
        isPending,
        addAssignment: addMutation.mutate,
        removeAssignment: removeMutation.mutate,
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,
        addError: addMutation.error,
    };
};
