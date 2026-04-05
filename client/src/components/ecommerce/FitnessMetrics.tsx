import { Link } from 'react-router';
import { useFitnessMetrics } from '../../hooks/useFitnessMetrics';
import type { FitnessMetricsDto } from '../../services/fitness-metrics';

const BMI_CATEGORY_LABELS: Record<FitnessMetricsDto['bmi']['category'], string> = {
    underweight: 'Underweight',
    normal_weight: 'Normal',
    overweight: 'Overweight',
    obesity: 'Obese',
};

const BMI_CATEGORY_COLORS: Record<FitnessMetricsDto['bmi']['category'], string> = {
    underweight: 'text-blue-500',
    normal_weight: 'text-success-500',
    overweight: 'text-warning-500',
    obesity: 'text-error-500',
};

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

    const { bmi, bmr, tdee, caloriesTarget, macros, bodyFat, heartRateZones } = fitnessMetrics;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">BMI</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{bmi.bmi}</p>
                    <p className={`mt-1 text-xs font-medium ${BMI_CATEGORY_COLORS[bmi.category]}`}>
                        {BMI_CATEGORY_LABELS[bmi.category]}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Body Fat</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{bodyFat}%</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">BMR</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{bmr}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">kcal / day</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">TDEE</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{tdee}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">kcal / day</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 col-span-2 sm:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Calorie Target</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{caloriesTarget}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">kcal / day</p>
                </div>
            </div>

            {/* Macros */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Daily Macros</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                        <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">{macros.protein}g</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
                        <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">{macros.fat}g</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                        <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">{macros.carbs}g</p>
                    </div>
                </div>
            </div>

            {/* Heart Rate Zones */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
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
            </div>
        </div>
    );
}
