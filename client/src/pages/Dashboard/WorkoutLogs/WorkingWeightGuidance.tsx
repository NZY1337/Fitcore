import { Link } from 'react-router';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useSettings } from '../../../hooks/useSettings';
import type { WorkoutLog } from '../../../services/workout-logs';
import type { CreateUserProfileDto } from '../../../services/user-profile';
import type { TrainingGoalSettings } from '../../../services/settings';

type WorkingWeightGuidanceProps = {
    latestLog?: WorkoutLog;
};

const TRAINING_GOAL_LABELS = {
    strength: {
        title: 'Strength',
    },
    hypertrophy: {
        title: 'Hypertrophy',
    },
    endurance: {
        title: 'Endurance',
    },
} as const;

const getProgressionGuidance = (
    guidance: TrainingGoalSettings,
    reps: number,
    workingWeight: number,
) => {
    const nextWeight = Number((workingWeight + guidance.progressionIncrementKg).toFixed(2));

    if (reps >= guidance.maxReps) {
        return {
            label: 'Progression',
            message: `You reached the top of the range. Move up to ${nextWeight} kg next time if your technique stayed solid.`,
        };
    }

    if (reps < guidance.minReps) {
        return {
            label: 'Adjustment',
            message: `You finished below the target range. Repeat ${workingWeight} kg until you can hit at least ${guidance.minReps} reps cleanly.`,
        };
    }

    return {
        label: 'Consistency',
        message: `Stay at ${workingWeight} kg and try to add reps until you reach ${guidance.maxReps} before increasing the load.`,
    };
};

const scrollToLogForm = () => {
    const form = document.getElementById('log-set-form');
    const exerciseInput = document.getElementById('exercise') as HTMLInputElement | null;

    form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    exerciseInput?.focus({ preventScroll: true });
};

export default function WorkingWeightGuidance({ latestLog }: WorkingWeightGuidanceProps) {
    const { userProfile, isPending } = useUserProfile();
    const { settings, isPending: isSettingsPending } = useSettings();

    if (isPending || isSettingsPending) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading your next-step guidance...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Next step</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Complete your{' '}
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        profile
                    </Link>{' '}
                    so the app can choose the right working weight for your goal.
                </p>
            </div>
        );
    }

    if (!latestLog) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Next step</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Log your first working set to get a personalized training recommendation for your next session.
                </p>
                <button
                    type="button"
                    onClick={scrollToLogForm}
                    className="mt-4 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                    Log your first set
                </button>
            </div>
        );
    }

    const trainingGoal = userProfile.training_goal as CreateUserProfileDto['training_goal'];
    const guidance = settings?.[trainingGoal];

    if (!guidance) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Next step</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Your training settings are unavailable right now. Visit{' '}
                    <Link to="/dashboard/settings" className="text-brand-500 underline">
                        settings
                    </Link>{' '}
                    to review them.
                </p>
            </div>
        );
    }

    const workingWeight = latestLog.workingWeight ?? latestLog.weight_kg;
    const progression = getProgressionGuidance(guidance, latestLog.reps, workingWeight);
    const repRange = `${guidance.minReps}-${guidance.maxReps} reps`;
    const setRange = `${guidance.minSets}-${guidance.maxSets} sets`;
    const goalLabel = TRAINING_GOAL_LABELS[trainingGoal].title;

    return (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/30 dark:bg-brand-500/10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                        What to do next
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                        Train {goalLabel.toLowerCase()} with {latestLog.exercise}
                    </h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm dark:bg-white/10 dark:text-brand-300">
                    {goalLabel}
                </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                For your next session, aim for{' '}
                <span className="font-semibold text-gray-800 dark:text-white">{workingWeight} kg</span>{' '}
                and complete{' '}
                <span className="font-semibold text-gray-800 dark:text-white">{setRange}</span>{' '}
                of{' '}
                <span className="font-semibold text-gray-800 dark:text-white">{repRange}</span>.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Working weight</p>
                    <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                        {workingWeight} kg
                    </p>
                </div>
                <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Estimated 1RM</p>
                    <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">{latestLog.oneRepMax} kg</p>
                </div>
                <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rep range</p>
                    <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">{repRange}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Set target</p>
                    <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">{setRange}</p>
                </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Based on your latest set of{' '}
                <span className="font-medium text-gray-800 dark:text-white">{latestLog.weight_kg} kg x {latestLog.reps} reps</span>,
                your estimated max is{' '}
                <span className="font-medium text-gray-800 dark:text-white">{latestLog.oneRepMax} kg</span>. {guidance.focus}
            </p>

            <div className="mt-4 rounded-xl border border-brand-200/70 bg-white/70 p-4 dark:border-brand-500/20 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
                    {progression.label}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{progression.message}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={scrollToLogForm}
                    className="inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                    Log next set
                </button>
                <Link
                    to="/dashboard/settings"
                    className="inline-flex rounded-lg border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/30 dark:text-brand-300 dark:hover:bg-brand-500/10"
                >
                    Edit settings
                </Link>
                <Link
                    to="/dashboard/user-profile"
                    className="inline-flex rounded-lg border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/30 dark:text-brand-300 dark:hover:bg-brand-500/10"
                >
                    Adjust goal
                </Link>
            </div>
        </div>
    );
}