import { Link } from 'react-router';
import { useFitnessMetrics } from '../../hooks/useFitnessMetrics';
import { useUserProfile } from '../../hooks/useUserProfile';

const ACTIVITY_GOAL_LABELS: Record<string, { label: string; badge: string }> = {
    cut: {
        label: 'Losing weight',
        badge: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
    },
    bulk: {
        label: 'Building muscle mass',
        badge: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    },
    maintain: {
        label: 'Maintaining weight',
        badge: 'bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-500',
    },
};

const TRAINING_GOAL_LABELS: Record<string, string> = {
    strength: 'Strength',
    hypertrophy: 'Hypertrophy',
    endurance: 'Endurance',
};

export default function GoalSummaryBanner() {
    const { userProfile, isPending: isPendingProfile } = useUserProfile();
    const { fitnessMetrics, isPending: isPendingMetrics } = useFitnessMetrics();

    if (isPendingProfile || isPendingMetrics) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading your goals...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">
                    Profile not set up
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        Complete your profile
                    </Link>{' '}
                    to see your personalised goal summary.
                </p>
            </div>
        );
    }

    const activityGoal = userProfile.activity_goal as string;
    const trainingGoal = userProfile.training_goal as string;
    const activityConfig = ACTIVITY_GOAL_LABELS[activityGoal] ?? ACTIVITY_GOAL_LABELS['maintain'];

    const calorieTarget = fitnessMetrics?.caloriesTarget;
    const macros = fitnessMetrics?.macros;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-brand-50/50 p-5 dark:border-gray-800 dark:from-white/[0.05] dark:via-white/[0.03] dark:to-brand-500/5 md:p-6 flex flex-col">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/20" />
            <div className="pointer-events-none absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-violet-500/5 blur-2xl dark:bg-violet-400/10" />
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Your Daily Goal
                </h3>
                <Link
                    to="/dashboard/user-profile"
                    className="text-sm text-brand-500 hover:underline"
                >
                    Edit profile
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1">
                <div className="flex flex-wrap gap-3 mb-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${activityConfig.badge}`}>
                        {activityConfig.label}
                    </span>
                    {trainingGoal && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                            {TRAINING_GOAL_LABELS[trainingGoal] ?? trainingGoal} training
                        </span>
                    )}
                </div>

                {calorieTarget && macros ? (
                    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="p-4 border-r border-b border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Daily calories</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                                {Math.round(calorieTarget)}{' '}
                                <span className="text-xs font-normal text-gray-400">kcal</span>
                            </p>
                        </div>
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Protein</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                                {Math.round(macros.protein)}{' '}
                                <span className="text-xs font-normal text-gray-400">g</span>
                            </p>
                        </div>
                        <div className="p-4 border-r border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Carbs</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                                {Math.round(macros.carbs)}{' '}
                                <span className="text-xs font-normal text-gray-400">g</span>
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fat</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                                {Math.round(macros.fat)}{' '}
                                <span className="text-xs font-normal text-gray-400">g</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Calorie and macro targets unavailable.
                    </p>
                )}

                <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">Your target goal is set to lose weight. We recommend a caloric deficit of 500 from your TDEE for sustainable weight loss.</p>
            </div>
        </div>
    );
}
