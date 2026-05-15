import { useState } from 'react';
import { Trophy, Download } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { usePersonalRecords } from '../../../hooks/usePersonalRecords';
import { useAppContext } from '../../../context/AppContext';
import { exportWorkoutCsv } from '../../../services/personal-records';

export default function PersonalRecordsPage() {
    const { records, isPending } = usePersonalRecords();
    const { session } = useAppContext();
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState('');

    const handleExport = async () => {
        if (!session?.access_token) return;
        setExporting(true);
        setExportError('');
        try {
            await exportWorkoutCsv(session.access_token);
        } catch (e) {
            setExportError(e instanceof Error ? e.message : 'Export failed');
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <PageMeta title="Personal Records" description="Your best lifts across all exercises" />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Personal Records</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Best estimated 1-rep max per exercise, calculated via Epley formula.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? 'Exporting…' : 'Export CSV'}
                    </button>
                </div>

                {exportError && (
                    <p className="mb-4 text-sm text-error-500">{exportError}</p>
                )}

                {isPending && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading records…</p>
                )}

                {!isPending && records.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-gray-400">
                        <Trophy className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">No records yet. Log some workouts to see your PRs here.</p>
                    </div>
                )}

                {!isPending && records.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                    <th className="pb-3 font-medium">Exercise</th>
                                    <th className="pb-3 pr-4 font-medium text-center">Weight</th>
                                    <th className="pb-3 pr-4 font-medium text-center">Reps</th>
                                    <th className="pb-3 pr-4 font-medium text-center" title="Estimated 1-rep max via Epley formula">Est. 1RM ⓘ</th>
                                    <th className="pb-3 pr-4 font-medium text-center">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {records.map((pr) => (
                                    <tr key={pr.exercise} className="text-gray-700 dark:text-gray-300">
                                        <td className="py-3 font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                                            {pr.exercise.charAt(0).toUpperCase() + pr.exercise.slice(1)}
                                        </td>
                                        <td className="py-3 pr-4 text-center">{pr.weight_kg} kg</td>
                                        <td className="py-3 pr-4 text-center">{pr.reps}</td>
                                        <td className="py-3 pr-4 text-center font-semibold text-brand-600 dark:text-brand-400">
                                            {pr.oneRepMax} kg
                                        </td>
                                        <td className="py-3 pr-4 text-center text-gray-400 dark:text-gray-500">
                                            {new Date(pr.achievedAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
