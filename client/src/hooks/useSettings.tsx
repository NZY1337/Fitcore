import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { getSettings, updateSettings, type UpdateSettingsDto } from '../services/settings';

export const useSettings = () => {
    const { session } = useAppContext();
    const queryClient = useQueryClient();
    const token = session?.access_token;

    const { data: settings, isPending, error } = useQuery({
        queryKey: ['settings', token],
        queryFn: () => {
            if (!token) throw new Error('No authentication token');
            return getSettings(token);
        },
        enabled: !!token,
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (dto: UpdateSettingsDto) => {
            if (!token) throw new Error('No authentication token');
            return updateSettings(token, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', token] });
            queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
        },
    });

    return {
        settings,
        isPending,
        error,
        isUpdating: updateSettingsMutation.isPending,
        updateSettings: updateSettingsMutation.mutate,
    };
};