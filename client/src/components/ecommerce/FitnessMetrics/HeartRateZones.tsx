import { Link } from 'react-router';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';

const HEART_RATE_ZONE_LABELS: Record<string, string> = {
    recovery: 'Recovery',
    fatBurn: 'Fat Burn',
    aerobic: 'Aerobic',
    anaerobic: 'Anaerobic',
    maxEffort: 'Max Effort',
};

const HEART_RATE_ZONE_COLORS: Record<string, string> = {
    recovery: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    fatBurn: 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400',
    aerobic: 'bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400',
    anaerobic: 'bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    maxEffort: 'bg-error-50 text-error-700 dark:bg-error-500/20 dark:text-error-400',
};

export default function HeartRateZones() {
    const { fitnessMetrics, isPending, error } = useFitnessMetrics();

    if (isPending) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading heart rate zones...</p>
            </div>
        );
    }

    if (error || !fitnessMetrics) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">No heart rate data available</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please{' '}
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        complete your profile
                    </Link>{' '}
                    to see your heart rate zones.
                </p>
            </div>
        );
    }

    const { heartRateZones } = fitnessMetrics;

    return (
        <>
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Heart Rate Zones</h3>
            <div className="space-y-2">
                {(Object.entries(heartRateZones) as [string, { min: number; max: number }][]).map(([zone, { min, max }]) => (
                    <div key={zone} className="flex items-center justify-between">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${HEART_RATE_ZONE_COLORS[zone]}`}>
                            {HEART_RATE_ZONE_LABELS[zone]}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {min} – {max} <span className="text-xs text-gray-400">bpm</span>
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
