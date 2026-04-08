import { Link } from 'react-router';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';
import type { FitnessMetricsDto } from '../../../services/fitness-metrics';
import RenderSingleMetric from './RenderFitnessMetric';

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

export default function Metrics() {
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

    const { bmi, bmr, tdee, caloriesTarget, bodyFat } = fitnessMetrics;

    return (
        <>
            <RenderSingleMetric label="BMI" value={bmi.bmi} subLabel={BMI_CATEGORY_LABELS[bmi.category]} color={BMI_CATEGORY_COLORS[bmi.category]} />

            <RenderSingleMetric label="Body Fat" value={`${bodyFat}%`} />

            <RenderSingleMetric label="BMR" value={bmr} subLabel="kcal / day" />

            <RenderSingleMetric label="TDEE" value={tdee} subLabel="kcal / day" />

            <RenderSingleMetric label="Calorie Target" value={caloriesTarget} subLabel="kcal / day" />
        </>
    );
}



