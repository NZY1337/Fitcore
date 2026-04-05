import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    addUserProfile,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    type CreateUserProfileDto,
} from '../services/user-profile/indes';

export const useUserProfile = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: userProfile, isPending, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getUserProfile(token);
        },
        enabled: !!token,
    });
 
    const createUserProfileMutation = useMutation({
        mutationFn: (dto: CreateUserProfileDto) => {
            if (!token) throw new Error('No authentication token');
            return addUserProfile(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    const updateUserProfileMutation = useMutation({
        mutationFn: (dto: Partial<CreateUserProfileDto>) => {
            if (!token) throw new Error('No authentication token');
            return updateUserProfile(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    const deleteUserProfileMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('No authentication token');
            return deleteUserProfile(token);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['userProfile'] });
        },
    });

    return {
        userProfile,
        isPending,
        error,
        createUserProfile: createUserProfileMutation.mutate,
        updateUserProfile: updateUserProfileMutation.mutate,
        deleteUserProfile: deleteUserProfileMutation.mutate,
        isCreating: createUserProfileMutation.isPending,
        isUpdating: updateUserProfileMutation.isPending,
        isDeleting: deleteUserProfileMutation.isPending,
    };
};

