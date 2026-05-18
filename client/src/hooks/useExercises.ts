import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getExercises, getExerciseById, getSimilarExercises } from '../services/exercises';

interface ExerciseFilters {
    q?: string;
    bodyPart?: string;
    equipment?: string;
    page?: number;
}

export const useExercises = (filters: ExerciseFilters = {}) => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data, isPending, error } = useQuery({
        queryKey: ['exercises', filters],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getExercises(token, filters);
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    return {
        exercises: data?.data ?? [],
        total: data?.total ?? 0,
        isPending,
        error,
    };
};

export const useExercise = (id: string | null) => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: exercise, isPending, error } = useQuery({
        queryKey: ['exercise', id],
        queryFn: () => {
            if (!token || !id) throw new Error('Missing token or id');
            return getExerciseById(token, id);
        },
        enabled: !!token && !!id,
        staleTime: 10 * 60 * 1000,
    });

    return { exercise, isPending, error };
};

export const useSimilarExercises = (id: string | null) => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: similar = [], isPending } = useQuery({
        queryKey: ['exercises-similar', id],
        queryFn: () => {
            if (!token || !id) throw new Error('Missing token or id');
            return getSimilarExercises(token, id);
        },
        enabled: !!token && !!id,
        staleTime: 10 * 60 * 1000,
    });

    return { similar, isPending };
};
