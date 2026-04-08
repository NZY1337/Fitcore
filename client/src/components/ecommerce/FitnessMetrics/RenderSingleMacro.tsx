

function RenderSingleMacro({ label, value, }: { label: string; value: number; }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">{value}g</p>
        </div>
    );
}

export default RenderSingleMacro;