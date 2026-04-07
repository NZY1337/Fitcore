
// https://tkdodo.eu/blog/testing-react-query


import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFitnessMetrics } from './useFitnessMetrics';

const mockGetFitnessMetrics = vi.hoisted(() => vi.fn());

vi.mock('../services/fitness-metrics', () => ({
    getFitnessMetrics: mockGetFitnessMetrics,
}));

vi.mock('../context/AppContext', () => ({
    useAppContext: () => ({ session: { access_token: 'test-token' } }),
}));

const mockMetrics = {
    bmi: 23.5,
    bmr: 1500,
    tdee: 2000,
    caloriesTarget: 1800,
    macros: { protein: 150, carbs: 200, fat: 50 },
    bodyFat: 15,
    heartRateZones: {
        recovery: { min: 93, max: 110 },
        fatBurn: { min: 111, max: 129 },
        aerobic: { min: 130, max: 147 },
        anaerobic: { min: 148, max: 166 },
        maxEffort: { min: 167, max: 184 },
    },
};

/*
    It’s one of the most common “gotchas” with React Query and testing: The library defaults to three retries with exponential backoff,
    which means that your tests are likely to timeout if you want to test an erroneous query.
*/

const wrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

describe('useFitnessMetrics', () => {
    it('should return fitness metrics data on success', async () => {
        mockGetFitnessMetrics.mockResolvedValue(mockMetrics);

        const { result } = renderHook(() => useFitnessMetrics(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        expect(result.current.fitnessMetrics).toEqual(mockMetrics);
        expect(result.current.error).toBeNull();
    });

    it('should return error when fetching fails', async () => {
        mockGetFitnessMetrics.mockRejectedValue(new Error('Failed to fetch metrics'));

        const { result } = renderHook(() => useFitnessMetrics(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.error).toBeTruthy());

        expect(result.current.error?.message).toBe('Failed to fetch metrics');

        expect(result.current.fitnessMetrics).toBeUndefined();
    });
});
