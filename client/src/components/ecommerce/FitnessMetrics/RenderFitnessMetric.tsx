interface RenderSingleMetricProps {
    label: string;
    value: string | number;
    subLabel?: string;
    color?: string;
}

function RenderSingleMetric({ label, value, subLabel, color }: RenderSingleMetricProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
            {subLabel && <p className={`mt-1 text-xs ${color ? color : 'text-gray-400'}`}>{subLabel}</p>}
        </div>
    );
}

export default RenderSingleMetric;