
// https://tkdodo.eu/blog/testing-react-query

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfile } from './useUserProfile';

const mockGetUserProfile = vi.hoisted(() => vi.fn());
const mockAddUserProfile = vi.hoisted(() => vi.fn());
const mockUpdateUserProfile = vi.hoisted(() => vi.fn());
const mockDeleteUserProfile = vi.hoisted(() => vi.fn());

vi.mock('../services/user-profile', () => ({
    getUserProfile: mockGetUserProfile,
    addUserProfile: mockAddUserProfile,
    updateUserProfile: mockUpdateUserProfile,
    deleteUserProfile: mockDeleteUserProfile,
}));

vi.mock('../context/AppContext', () => ({
    useAppContext: () => ({ session: { access_token: 'test-token' } }),
}));

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

describe('useUserProfile hook', () => {
    beforeEach(() => {
        mockGetUserProfile.mockReset();
    });

    it('should fetch user profile', async () => {
        mockGetUserProfile.mockResolvedValue({ id: 1, name: 'Andrei' });

        const { result } = renderHook(() => useUserProfile(), {
            wrapper: wrapper(),
        });

        await waitFor(() => {
            expect(result.current.isPending).toBe(false);
        });

        expect(result.current.userProfile).toEqual({ id: 1, name: 'Andrei' });
    });

    it('should create user profile and invalidate queries', async () => {
        mockGetUserProfile
            .mockResolvedValueOnce(null)                        // fetch inițial: profil inexistent
            .mockResolvedValueOnce({ gender: 'male', weight_kg: 70 }); // după create

        mockAddUserProfile.mockResolvedValue({});

        const { result } = renderHook(() => useUserProfile(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        await waitFor(async () => {
            result.current.createUserProfile({
                gender: 'male',
                weight_kg: 70,
                height_cm: 175,
                waist_cm: 80,
                neck_cm: 40,
                hip_cm: 90,
                date_of_birth: '1990-01-06',
                activity_level: 'sedentary',
                activity_goal: 'maintain',
                training_goal: 'strength',
            });
        });

        expect(mockAddUserProfile).toHaveBeenCalledWith('test-token', expect.objectContaining({ gender: 'male' }));

        await waitFor(() => {
            expect(result.current.userProfile).toEqual(
                expect.objectContaining({ gender: 'male', weight_kg: 70 })
            );
        });
    });

    it('should update user profile and invalidate queries', async () => {
        mockGetUserProfile
            .mockResolvedValueOnce({ id: 1, name: 'Andrei', weight_kg: 70 })  // fetch inițial
            .mockResolvedValueOnce({ id: 1, name: 'Andrei', weight_kg: 75 }); // după invalidate

        const { result } = renderHook(() => useUserProfile(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        await waitFor(async () => {
            result.current.updateUserProfile({ weight_kg: 75 });
        });

        expect(mockUpdateUserProfile).toHaveBeenCalledWith('test-token', expect.objectContaining({ weight_kg: 75 }));

        // Verificăm că după invalidare, datele noi au fost fetched
        await waitFor(() => {
            expect(result.current.userProfile).toEqual(
                expect.objectContaining({ weight_kg: 75 })
            );
        });
    });

    it('should delete user profile and invalidate queries', async () => {
        mockGetUserProfile
            .mockResolvedValueOnce({ id: 1, name: 'Andrei' })  // fetch inițial
            .mockResolvedValueOnce(null);                        // după delete

        mockDeleteUserProfile.mockResolvedValue({});

        const { result } = renderHook(() => useUserProfile(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        result.current.deleteUserProfile();

        await waitFor(() => {
            expect(mockDeleteUserProfile).toHaveBeenCalledWith('test-token');
        });

        await waitFor(() => {
            expect(result.current.userProfile).toBeNull();
        });
    });

    it('should handle error when fetching user profile', async () => {
        mockGetUserProfile.mockRejectedValue(new Error('Failed to fetch profile'));

        const { result } = renderHook(() => useUserProfile(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.error).toBeTruthy());

        expect(result.current.error?.message).toBe('Failed to fetch profile');
    });
});
