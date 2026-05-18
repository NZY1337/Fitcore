import { BarChart2, DollarSign, Hash, Zap } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useAiUsageLogs } from '../../../hooks/useAdmin';

export default function AiUsagePage() {
    const { logs, isPending } = useAiUsageLogs();

    const totals = logs.reduce(
        (acc, row) => ({
            requests: acc.requests + Number(row.requests),
            prompt_tokens: acc.prompt_tokens + Number(row.prompt_tokens),
            completion_tokens: acc.completion_tokens + Number(row.completion_tokens),
            cost: acc.cost + Number(row.total_cost_usd),
        }),
        { requests: 0, prompt_tokens: 0, completion_tokens: 0, cost: 0 },
    );

    return (
        <>
            <PageMeta title="AI Usage" description="AI API usage and costs" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Usage</h1>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard icon={<Hash className="size-5" />} label="Total Requests" value={String(totals.requests)} />
                    <StatCard icon={<Zap className="size-5" />} label="Prompt Tokens" value={totals.prompt_tokens.toLocaleString()} />
                    <StatCard icon={<BarChart2 className="size-5" />} label="Completion Tokens" value={totals.completion_tokens.toLocaleString()} />
                    <StatCard icon={<DollarSign className="size-5" />} label="Total Cost" value={`$${totals.cost.toFixed(4)}`} highlight />
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-right">Requests</th>
                                <th className="px-4 py-3 text-right">Prompt Tokens</th>
                                <th className="px-4 py-3 text-right">Completion Tokens</th>
                                <th className="px-4 py-3 text-right">Cost (USD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isPending ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                        No AI requests logged yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((row) => (
                                    <tr key={row.date} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{row.date}</td>
                                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{row.requests}</td>
                                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{Number(row.prompt_tokens).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{Number(row.completion_tokens).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                                            ${Number(row.total_cost_usd).toFixed(4)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}

function StatCard({ icon, label, value, highlight }: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col gap-2">
            <div className={`flex items-center gap-2 text-sm font-medium ${highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {icon}
                {label}
            </div>
            <p className={`text-2xl font-bold ${highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                {value}
            </p>
        </div>
    );
}
