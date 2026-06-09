import { vi, describe, it, expect, beforeEach, } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { useAiMealPlan } from '../../../hooks/useAiMealPlan';
import AiMealPlanPage from './AiMealPlanPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageMeta from '../../../components/common/PageMeta';

import type { AiMealPlan } from '../../../services/ai-meal-plan';

type AiMealPlanHook = ReturnType<typeof useAiMealPlan>;

const basePlan: AiMealPlan = {
    id: 'plan-1',
    user_id: 'user-1',
    preferences: { allergies: [], avoid: [], diet_type: 'balanced', meals_per_day: 3 },
    selected_variant_index: null,
    is_activated: false,
    created_at: '2026-01-01T00:00:00Z',
    variants: [],
};

const baseAiMealPlan: AiMealPlanHook = {
    currentPlan: { ...basePlan },
    isLoadingCurrent: false,
    generate: vi.fn(),
    isGenerating: false,
    generateError: null,
    selectVariant: vi.fn(),
    isSelecting: false,
    isActivated: false,
}

// -- Hook mocks --

vi.mock('../../../hooks/useAiMealPlan', () => ({
    useAiMealPlan: vi.fn()
}));

vi.mock('../../../components/common/PageMeta', () => ({
    default: vi.fn(() => null),
}));


// -- Helpers --

function makeWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

function renderAiMealPlanPage() {
    return render(<AiMealPlanPage />, { wrapper: makeWrapper() })
}


function mockDefaultHooks() {
    vi.mocked(useAiMealPlan).mockReturnValue({
        ...baseAiMealPlan
    } as any);
}

// -- Tests -- 

describe('AiMealPlanPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDefaultHooks();
    })

    it('shows the wizard when there is no current plan', () => {

        vi.mocked(useAiMealPlan).mockReturnValue({
            ...baseAiMealPlan,
            currentPlan: null,
        } as any);

        renderAiMealPlanPage();

        expect(screen.getByText('Generator Plan Alimentar AI')).toBeInTheDocument();
    });

    it('renders with correct page title', () => {
        renderAiMealPlanPage();

        expect(PageMeta).toHaveBeenCalledWith(
            {
                title: 'AI Meal Plan',
                description: 'Plan alimentar personalizat generat cu AI'
            },
            undefined
        );
    });

    it('shows regenerate button when a plan exists and opens wizard on click', () => {
        vi.mocked(useAiMealPlan).mockReturnValue({
            ...baseAiMealPlan,
            currentPlan: { id: '1', variants: [] },
        } as any);

        renderAiMealPlanPage();

        const btn = screen.getByRole('button', { name: /regenereaza/i });
        expect(btn).toBeInTheDocument();

        fireEvent.click(btn);

        expect(screen.getByText('Generator Plan Alimentar AI')).toBeInTheDocument();
    });

    it('shows shows the loader while generating meal plan', () => {
        vi.mocked(useAiMealPlan).mockReturnValue({
            ...baseAiMealPlan,
            isGenerating: true,
        } as AiMealPlanHook);

        renderAiMealPlanPage();

        expect(screen.getByText('Dureaza 10-20 secunde')).toBeInTheDocument();
    });

    it('should generate error while generating meal plan', () => {
        vi.mocked(useAiMealPlan).mockReturnValue({
            ...baseAiMealPlan,
            generateError: 'error while generating meal plan',
        } as AiMealPlanHook);

        renderAiMealPlanPage();

        expect(screen.getByText('error while generating meal plan')).toBeInTheDocument();
    });

    it('shows success banner after selecting a plan variant', async () => {
        const mockSelectVariant = vi.fn().mockResolvedValue(undefined);

        vi.mocked(useAiMealPlan).mockReturnValue({
            ...baseAiMealPlan,
            currentPlan: {
                id: 'plan-1',
                user_id: 'user-1',
                preferences: { allergies: [], avoid: [], diet_type: 'balanced', meals_per_day: 3 },
                selected_variant_index: null,
                is_activated: false,
                created_at: '2026-01-01T00:00:00Z',
                variants: [{
                    name: 'Plan 1',
                    description: '',
                    daily_targets: { calories: 2000, protein: 150, carbs: 200, fat: 60 },
                    meals: [],
                }],
            },

            selectVariant: mockSelectVariant,
        } as AiMealPlanHook);

        renderAiMealPlanPage();

        fireEvent.click(screen.getByRole('button', { name: /alege acest plan/i }));

        await waitFor(() => {
            expect(screen.getByText('Plan alimentar activat!')).toBeInTheDocument();
        });
    });



})

