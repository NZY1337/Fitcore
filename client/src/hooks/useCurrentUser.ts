import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getCurrentUser } from '../services/user';

export const useCurrentUser = () => {
    const { session } = useAppContext();
    const token = session?.access_token;

    const { data: currentUser, isPending } = useQuery({
        queryKey: ['currentUser', token],
        queryFn: () => {
            if (!token) throw new Error('No token');
            return getCurrentUser(token);
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });

    return {
        currentUser,
        isPending,
        isAdmin: currentUser?.role === 'admin',
    };
};
