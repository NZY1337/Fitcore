import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getPersonalRecords } from '../services/personal-records';

export const usePersonalRecords = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: records = [], isPending, error } = useQuery({
        queryKey: ['personalRecords'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getPersonalRecords(token);
        },
        enabled: !!token,
    });

    return { records, isPending, error };
};
