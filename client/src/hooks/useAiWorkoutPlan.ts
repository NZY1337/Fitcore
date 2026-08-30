import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    generateAiPlan,
    selectAiPlanVariant,
    getCurrentAiPlan,
    type GeneratePlanDto,
    type SelectPlanDto,
} from '../services/ai-workout-plan';

export function useAiWorkoutPlan() {
    const { session } = useAppContext();
    const token = session?.access_token ?? '';
    const queryClient = useQueryClient();

    const currentPlanQuery = useQuery({
        queryKey: ['ai-workout-plan', 'current'],
        queryFn: () => getCurrentAiPlan(token),
        enabled: !!token,
    });

    const generateMutation = useMutation({
        mutationFn: (dto: GeneratePlanDto) => generateAiPlan(token, dto),
        onSuccess: (data) => {
            queryClient.setQueryData(['ai-workout-plan', 'current'], data);
        },
    });

    const selectMutation = useMutation({
        mutationFn: (dto: SelectPlanDto) => selectAiPlanVariant(token, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-workout-plan'] });
            queryClient.invalidateQueries({ queryKey: ['workout-assignments'] });
        },
    });

    return {
        currentPlan: currentPlanQuery.data ?? null,
        isLoadingCurrent: currentPlanQuery.isPending,
        generate: generateMutation.mutateAsync,
        isGenerating: generateMutation.isPending,
        generateError: generateMutation.error?.message ?? null,
        selectVariant: selectMutation.mutateAsync,
        isSelecting: selectMutation.isPending,
        selectError: selectMutation.error?.message ?? null,
        isActivated: selectMutation.isSuccess,
    };
}
