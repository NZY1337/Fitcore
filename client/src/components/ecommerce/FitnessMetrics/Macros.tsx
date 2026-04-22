import { Link } from 'react-router';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';
import RenderSingleMacro from './RenderSingleMacro';

export default function Macros() {
    const { fitnessMetrics, isPending, error } = useFitnessMetrics();

    if (isPending) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading macros...</p>
            </div>
        );
    }

    if (error || !fitnessMetrics) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">No macro data available</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please{' '}
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        complete your profile
                    </Link>{' '}
                    to see your daily macros.
                </p>
            </div>
        );
    }

    const { macros } = fitnessMetrics;

    return (
        <>
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Daily Macros</h3>
            <div className="grid grid-cols-3 gap-4">
                <RenderSingleMacro label="Protein" value={macros.protein} />
                <RenderSingleMacro label="Fat" value={macros.fat} />
                <RenderSingleMacro label="Carbs" value={macros.carbs} />
            </div>
        </>
    );
}
