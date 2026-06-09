import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

import type { AdminStats } from '../../services/admin';

// ── Hook mocks ────────────────────────────────────────────────────────────────

vi.mock('../../hooks/useCurrentUser', () => ({
    useCurrentUser: vi.fn(),
}));

vi.mock('../../hooks/useAdmin', () => ({
    useAdminStats: vi.fn(),
}));

vi.mock('../../hooks/useWorkoutLogs', () => ({
    useWorkoutLogs: vi.fn(),
}));

vi.mock('../../hooks/useWeightLogs', () => ({
    useWeightLogs: vi.fn(),
}));

vi.mock('../../hooks/useNutritionLogs', () => ({
    useNutritionLogs: vi.fn(),
}));

vi.mock('../../hooks/useFitnessMetrics', () => ({
    useFitnessMetrics: vi.fn(),
}));

// ── Component mocks ───────────────────────────────────────────────────────────

vi.mock('../../components/ecommerce/FitnessMetrics/FitnessMetrics', () => ({
    default: () => <div data-testid="fitness-metrics" />,
}));

vi.mock('../../components/ecommerce/GoalSummaryBanner', () => ({
    default: () => <div data-testid="goal-summary-banner" />,
}));

vi.mock('../../components/ecommerce/MonthlyTarget', () => ({
    default: () => <div data-testid="monthly-target" />,
}));

vi.mock('../../components/common/PageMeta', () => ({
    default: () => null,
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useAdminStats } from '../../hooks/useAdmin';
import { useWorkoutLogs } from '../../hooks/useWorkoutLogs';
import { useWeightLogs } from '../../hooks/useWeightLogs';
import { useNutritionLogs } from '../../hooks/useNutritionLogs';
import { useFitnessMetrics } from '../../hooks/useFitnessMetrics';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseAdminStats: AdminStats = {
    totalUsers: 10,
    adminCount: 1,
    userCount: 9,
    newLast7Days: 0,
    newLast30Days: 0,
    totalAssignments: 0,
    usersWithPlan: 0,
    topExercises: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
    );
}

function renderHome() {
    return render(<Home />, { wrapper: makeWrapper() });
}

function mockDefaultHooks() {
    vi.mocked(useWorkoutLogs).mockReturnValue({ workoutLogs: [], isPending: false } as any);
    vi.mocked(useWeightLogs).mockReturnValue({ weightLogs: [], isPending: false } as any);
    vi.mocked(useNutritionLogs).mockReturnValue({ nutritionLogs: [], isPending: false } as any);
    vi.mocked(useFitnessMetrics).mockReturnValue({ fitnessMetrics: null, isPending: false } as any);
    vi.mocked(useAdminStats).mockReturnValue({ stats: null, isPending: false } as any);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDefaultHooks();
    });

    it('renders nothing while user auth is pending', () => {
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: false, isPending: true } as any);

        const { container } = renderHome();

        expect(container).toBeEmptyDOMElement();
    });

    it('renders AdminDashboard when user is admin', () => {
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: true, isPending: false } as any);
        vi.mocked(useAdminStats).mockReturnValue({
            stats: null,
            isPending: true,
        } as any);

        renderHome();

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('renders UserDashboard when user is not admin', () => {
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: false, isPending: false } as any);

        renderHome();

        expect(screen.getByTestId('fitness-metrics')).toBeInTheDocument();
        expect(screen.getByTestId('goal-summary-banner')).toBeInTheDocument();
        expect(screen.getByTestId('monthly-target')).toBeInTheDocument();
    });
});

describe('AdminDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDefaultHooks();
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: true, isPending: false } as any);
    });

    it('shows loading skeletons while stats are pending', () => {
        vi.mocked(useAdminStats).mockReturnValue({ stats: null, isPending: true } as any);

        const { container } = renderHome();

        expect(container.querySelectorAll('.animate-pulse')).toHaveLength(4);
    });

    it('renders stat cards with correct values', () => {
        vi.mocked(useAdminStats).mockReturnValue({
            isPending: false,
            stats: { ...baseAdminStats, totalUsers: 42, adminCount: 2, userCount: 40, newLast7Days: 5, newLast30Days: 18, totalAssignments: 120, usersWithPlan: 30 },
        } as any);

        renderHome();

        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('2 admin · 40 user')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('shows empty state when there are no top exercises', () => {
        vi.mocked(useAdminStats).mockReturnValue({
            isPending: false,
            stats: { ...baseAdminStats, topExercises: [] },
        } as any);

        renderHome();

        expect(screen.getByText('No assignments yet.')).toBeInTheDocument();
    });

    it('renders top exercises list when data is available', () => {
        vi.mocked(useAdminStats).mockReturnValue({
            isPending: false,
            stats: { ...baseAdminStats, topExercises: [{ name: 'squat', count: 10 }, { name: 'bench press', count: 7 }] },
        } as any);

        renderHome();

        expect(screen.getByText('Squat')).toBeInTheDocument();
        expect(screen.getByText('Bench press')).toBeInTheDocument();
    });

    it('links to manage users and browse exercises', () => {
        vi.mocked(useAdminStats).mockReturnValue({
            isPending: false,
            stats: baseAdminStats,
        } as any);

        renderHome();

        expect(screen.getByRole('link', { name: /manage users/i })).toHaveAttribute('href', '/dashboard/admin');
        expect(screen.getByRole('link', { name: /browse exercises/i })).toHaveAttribute('href', '/dashboard/exercises');
    });
});

describe('UserDashboard — streak banner', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDefaultHooks();
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: false, isPending: false } as any);
    });

    it('shows streak banner when workout logs form a current streak', () => {
        const today = new Date().toISOString();
        vi.mocked(useWorkoutLogs).mockReturnValue({
            workoutLogs: [{ created_at: today }],
            isPending: false,
        } as any);

        renderHome();

        expect(screen.getByText(/1-day workout streak/i)).toBeInTheDocument();
    });

    it('hides streak banner when there are no workout logs', () => {
        vi.mocked(useWorkoutLogs).mockReturnValue({ workoutLogs: [], isPending: false } as any);

        renderHome();

        expect(screen.queryByText(/workout streak/i)).not.toBeInTheDocument();
    });
});

describe('WeeklyProgress', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDefaultHooks();
        vi.mocked(useCurrentUser).mockReturnValue({ isAdmin: false, isPending: false } as any);
    });

    it('shows — when no nutrition logs exist', () => {
        vi.mocked(useNutritionLogs).mockReturnValue({ nutritionLogs: [], isPending: false } as any);

        renderHome();

        expect(screen.queryByText(/kcal\/zi/)).not.toBeInTheDocument();
    });

    it('shows average calories per day when nutrition logs exist', () => {
        const today = new Date().toISOString().slice(0, 10);
        vi.mocked(useNutritionLogs).mockReturnValue({
            nutritionLogs: [{ logged_at: `${today}T10:00:00`, calories: 2000 }],
            isPending: false,
        } as any);

        renderHome();

        expect(screen.getByText(/2000 kcal\/zi/)).toBeInTheDocument();
    });

    it('shows — for weight delta when fewer than 2 weight logs exist', () => {
        vi.mocked(useWeightLogs).mockReturnValue({
            weightLogs: [{ weight_kg: 80, measured_at: new Date().toISOString() }],
            isPending: false,
        } as any);

        renderHome();

        expect(screen.getByText('Evoluție greutate (7 zile)')).toBeInTheDocument();
    });

    it('shows weight delta when 2+ weight logs exist spanning 7 days', () => {
        const now = new Date();
        const eightDaysAgo = new Date(now);
        eightDaysAgo.setDate(now.getDate() - 8);

        vi.mocked(useWeightLogs).mockReturnValue({
            weightLogs: [
                { weight_kg: 82, measured_at: eightDaysAgo.toISOString() },
                { weight_kg: 80, measured_at: now.toISOString() },
            ],
            isPending: false,
        } as any);

        renderHome();

        expect(screen.getByText('-2 kg')).toBeInTheDocument();
    });

    it('shows workout count for the week', () => {
        const today = new Date().toISOString();
        vi.mocked(useWorkoutLogs).mockReturnValue({
            workoutLogs: [{ created_at: today }],
            isPending: false,
        } as any);

        renderHome();

        expect(screen.getByText(/^1$/)).toBeInTheDocument();
        expect(screen.getByText(/\/ 7 zile/)).toBeInTheDocument();
    });
});
