export function MacroBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
    const pct = Math.min((value / total) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{value}g <span className="font-normal text-gray-400">/ {total}g</span></span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
