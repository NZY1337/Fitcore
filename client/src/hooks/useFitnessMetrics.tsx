// hooks/useFitnessMetrics.ts
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getFitnessMetrics } from '../services/fitness-metrics';

export const useFitnessMetrics = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: fitnessMetrics, isPending, error } = useQuery({
        queryKey: ['fitnessMetrics', token],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getFitnessMetrics(token);
        },
        enabled: !!token,
    });

    return { fitnessMetrics, isPending, error };
};