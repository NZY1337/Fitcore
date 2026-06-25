import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import FitnessMetrics from '../../../components/ecommerce/FitnessMetrics/FitnessMetrics';
import GoalSummaryBanner from '../../../components/ecommerce/GoalSummaryBanner';
import MonthlyTarget from '../../../components/ecommerce/MonthlyTarget';
import { useWorkoutLogs } from '../../../hooks/useWorkoutLogs';
import { computeStreak } from './utils';
import WeeklyProgress from './WeeklyProgress';
import HeartRateZones from '../../../components/ecommerce/FitnessMetrics/HeartRateZones';

export default function UserDashboard() {
    const { workoutLogs } = useWorkoutLogs();
    const streak = useMemo(() => computeStreak(workoutLogs), [workoutLogs]);

    return (
        <>
            <PageMeta
                title="Fitness Metrics - Dashboard"
                description="View your fitness metrics and track your progress over time on the dashboard."
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {streak > 0 && (
                    <div className="col-span-12">
                        <div className="flex items-center rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-500/10 px-5 py-4">
                            <Flame className="w-6 h-6 text-orange-500 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                    {streak}-day workout streak!
                                </p>
                                <p className="text-xs text-orange-500 dark:text-orange-400">
                                    Keep it up — consistency is everything.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-1 xl:grid-cols-2 md:gap-6">
                    <MonthlyTarget />
                    <GoalSummaryBanner />
                </div>

                <div className="col-span-12 space-y-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 md:gap-4">
                        <FitnessMetrics />
                    </div>
                </div>

                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                    <WeeklyProgress />
                    <HeartRateZones />
                </div>
            </div>
        </>
    );
}
