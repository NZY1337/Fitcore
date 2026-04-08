import { Link } from 'react-router';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';
import Metrics from './Metrics';
import Macros from './Macros';
import HeartRateZones from './HeartRateZones';

export default function FitnessMetrics() {
    const { fitnessMetrics, isPending, error } = useFitnessMetrics();

    if (isPending) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading fitness metrics...</p>
            </div>
        );
    }

    if (error || !fitnessMetrics) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">No fitness data available</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please{' '}
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        complete your profile
                    </Link>{' '}
                    to see your fitness metrics.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
                <Metrics />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <Macros />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <HeartRateZones />
            </div>

        </div>
    );
}
