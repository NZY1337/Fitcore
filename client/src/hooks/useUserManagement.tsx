import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, getUsers, updateUserConsent, updateUserRole, deleteUser } from '../services/users';
import { useAuth } from '@clerk/clerk-react';

import type { UserProps } from '../types';

export const useUsersManagement = ({
    onUserDeleted = () => { },
    onDeleteModalClose = () => { },
}: {
    onUserDeleted?: () => void;
    onDeleteModalClose?: () => void;
} = {}) => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return getUser(token);
        },
    });

    const { isPending, error, data: users, } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return getUsers(token);
        },
    });

    const updateUserConsentMutation = useMutation({
        mutationFn: async ({ userId }: { userId: UserProps['id']; }) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return updateUserConsent(userId, token);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    })

    const updateUserRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: UserProps['id']; role: UserProps['role'] }) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return updateUserRole(userId, role, token);
        },

        onMutate: async ({ userId, role }) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData<UserProps[]>(['users']);

            queryClient.setQueryData(['users'], (old: UserProps[]) =>
                old.map((user: UserProps) =>
                    user.id === userId ? { ...user, role } : user
                ) || []
            );

            return { previousUsers };
        },

        onSuccess: (_data, _variables) => {
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return deleteUser(userId, token);
        },

        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData<UserProps[]>(['users']);

            queryClient.setQueryData(['users'], (old: UserProps[]) =>
                old.filter((user: UserProps) => user.id !== userId)
            );

            return { previousUsers: previousUsers || [] };
        },

        onError: (_error, _, context?: { previousUsers: UserProps[] }) => {
            if (context && context.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
            onDeleteModalClose();
        },

        onSuccess: () => {
            onUserDeleted();
            onDeleteModalClose();
        },
    });

    return {
        user,
        users,
        isPending,
        error,
        updateUserConsentMutation,
        updateUserRoleMutation,
        deleteUserMutation,
    };
};
