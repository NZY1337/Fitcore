import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import {
    generateAiMealPlan,
    selectAiMealPlanVariant,
    getCurrentAiMealPlan,
    type GenerateMealPlanDto,
    type SelectMealPlanDto,
} from '../services/ai-meal-plan';

export function useAiMealPlan() {
    const { session } = useAppContext();
    const token = session?.access_token ?? '';
    const queryClient = useQueryClient();

    const currentPlanQuery = useQuery({
        queryKey: ['ai-meal-plan', 'current'],
        queryFn: () => getCurrentAiMealPlan(token),
        enabled: !!token,
    });

    const generateMutation = useMutation({
        mutationFn: (dto: GenerateMealPlanDto) => generateAiMealPlan(token, dto),
        onSuccess: (data) => {
            queryClient.setQueryData(['ai-meal-plan', 'current'], data);
        },
    });

    const selectMutation = useMutation({
        mutationFn: (dto: SelectMealPlanDto) => selectAiMealPlanVariant(token, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-meal-plan'] });
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
        isActivated: selectMutation.isSuccess,
    };
}
