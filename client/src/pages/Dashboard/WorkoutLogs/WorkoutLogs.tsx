import { useState, useMemo } from 'react';
import Metrics from '../../../components/ecommerce/FitnessMetrics/Metrics';
import Macros from '../../../components/ecommerce/FitnessMetrics/Macros';
import PageMeta from '../../../components/common/PageMeta';
import Form from '../../../components/form/Form';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Button from '../../../components/ui/button/Button';
import Alert from '../../../components/ui/alert/Alert';
import { useWorkoutLogs } from '../../../hooks/useWorkoutLogs';
import { useAutoDismiss } from '../../../hooks/useAutoDismiss';
import type { CreateWorkoutLogDto, WorkoutLog } from '../../../services/workout-logs';
import { validateWorkoutLog } from './workoutLogs.validation';
import type { WorkoutLogFormState as FormState, WorkoutLogFormErrors as FormErrors } from './workoutLogs.validation';
import useDebounce from '../../../hooks/useDebounce';

const initialFormState: FormState = {
    exercise: '',
    sets: '',
    reps: '',
    weight_kg: '',
};

const asInt = (v: string) => Number.parseInt(v, 10);
const asFloat = (v: string) => Number.parseFloat(v);

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
};

type EnrichedLog = WorkoutLog & { oneRepMax: number; volume: number; workingWeight?: number };

function groupByDate(logs: EnrichedLog[]) {
    const map = new Map<string, EnrichedLog[]>();
    for (const log of logs) {
        const key = new Date(log.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(log);
    }
    // Sort dates descending (newest first)
    return Array.from(map.entries()).sort(
        (a, b) => new Date(b[1][0].created_at).getTime() - new Date(a[1][0].created_at).getTime()
    );
}

export default function WorkoutLogs() {
    const { workoutLogs, isPending, isCreating, isDeleting, addWorkoutLog, removeWorkoutLog } = useWorkoutLogs();
    const [visibleLogs, setVisibleLogs] = useState(3);
    const [form, setForm] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [openDays, setOpenDays] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 400);

    const filteredLogs = useMemo(() => {
        if (!debouncedQuery) return workoutLogs;

        return workoutLogs.filter(log =>
            log.exercise.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [workoutLogs, debouncedQuery]);

    const allGrouped = groupByDate(filteredLogs);
    const grouped = allGrouped.slice(0, visibleLogs); // Limit to most recent days
    const hasMore = allGrouped.length > visibleLogs;

    const handleSearch = () => {
        useMemo(() => {
            if (!query.trim()) return workoutLogs;
            return workoutLogs.filter(log => log.exercise.toLowerCase().includes(query.toLowerCase()));
        }, [workoutLogs, query]);
    };

    // Auto-open the most recent day when data loads
    const latestDay = grouped[0]?.[0];

    const toggleDay = (day: string) => {
        setOpenDays(prev => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            return next;
        });
    };

    const isDayOpen = (day: string) => {
        // If nothing manually toggled yet, default-open the first (newest) day
        if (openDays.size === 0) return day === latestDay;
        return openDays.has(day);
    };

    const validate = validateWorkoutLog;

    const onChange = <K extends keyof FormState>(key: K, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        if (submitError) setSubmitError('');
        if (submitMessage) setSubmitMessage('');
    };

    const handleSubmit = () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const payload: CreateWorkoutLogDto = {
            exercise: form.exercise.trim(),
            sets: asInt(form.sets),
            reps: asInt(form.reps),
            weight_kg: asFloat(form.weight_kg),
        };

        addWorkoutLog(payload, {
            onSuccess: () => {
                setSubmitMessage('Workout logged successfully.');
                setForm(initialFormState);
            },
            onError: (err: unknown) => setSubmitError(getErrorMessage(err)),
        });
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        removeWorkoutLog(id, {
            onSuccess: () => setDeletingId(null),
            onError: (err: unknown) => {
                setDeletingId(null);
                setSubmitError(getErrorMessage(err));
            },
        });
    };

    return (
        <>
            <PageMeta
                title="Workout Logs"
                description="Log and track your workouts"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Workout History */}
                <div className="col-span-12 xl:col-span-7">

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Workout History</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                1RM and working weight are calculated from your training goal.
                            </p>
                        </div>

                        {isPending && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading logs...</p>
                        )}

                        {!isPending && workoutLogs.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No workouts logged yet.</p>
                        )}

                        {!isPending && grouped.length > 0 && (() => {
                            const latest = grouped[0][1][0];
                            return (
                                <>
                                    <div className="mb-5 rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm dark:bg-brand-500/10 dark:border-brand-500/30">
                                        <p className="font-semibold text-brand-700 dark:text-brand-400 mb-1">Cum să interpretezi datele</p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Pe baza <span className="font-medium text-gray-800 dark:text-white">{latest.exercise}</span> cu{' '}
                                            <span className="font-medium text-gray-800 dark:text-white">{latest.weight_kg} kg × {latest.reps} reps</span>,
                                            se estimează că poți ridica maxim{' '}
                                            <span className="font-medium text-gray-800 dark:text-white">{latest.oneRepMax} kg</span> o singură dată (1RM).
                                            {latest.workingWeight != null && (
                                                <> Greutatea recomandată pentru antrenamentul tău este{' '}
                                                    <span className="font-medium text-gray-800 dark:text-white">{latest.workingWeight} kg</span> —
                                                    lucrează cu aceasta la {latest.reps > 6 ? '4–6' : '3–5'} repetări pentru a progresa.</>
                                            )}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition">
                                            <input
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                type="text"
                                                placeholder="Search something..."
                                                className="w-full px-5 py-3 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                                            />

                                            <button onClick={handleSearch}
                                                className="m-1 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition text-white font-medium">
                                                Search
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {grouped.map(([day, logs]) => {
                                            const open = isDayOpen(day);
                                            const totalVolume = logs.reduce((sum, l) => sum + l.volume, 0);
                                            return (
                                                <div key={day} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                                    {/* Accordion header */}
                                                    <button
                                                        onClick={() => toggleDay(day)}
                                                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{day}</span>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                {logs.length} {logs.length === 1 ? 'set' : 'sets'} · {totalVolume.toLocaleString()} kg total volume
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
                                                    </button>

                                                    {/* Accordion body */}
                                                    {open && (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left">
                                                                <thead>
                                                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                                                        <th className="px-4 pb-3 pt-2 font-medium">Exercise</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Sets</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Reps</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Weight</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Greutatea maximă estimată pentru o singură repetare (formula Epley)">1RM ⓘ</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Greutatea recomandată de antrenament bazată pe 1RM și obiectivul tău">Working wt. ⓘ</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Volum total = seturi × repetări × greutate">Volume ⓘ</th>
                                                                        <th className="pb-3 pt-2"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                                    {logs.map((log) => (
                                                                        <tr key={log.id} className="text-gray-700 dark:text-gray-300">
                                                                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">{log.exercise}</td>
                                                                            <td className="py-3 pr-4 text-center">{log.sets}</td>
                                                                            <td className="py-3 pr-4 text-center">{log.reps}</td>
                                                                            <td className="py-3 pr-4 text-center">{log.weight_kg} kg</td>
                                                                            <td className="py-3 pr-4 text-center">{log.oneRepMax} kg</td>
                                                                            <td className="py-3 pr-4 text-center">
                                                                                {log.workingWeight != null ? `${log.workingWeight} kg` : '—'}
                                                                            </td>
                                                                            <td className="py-3 pr-4 text-center">{log.volume} kg</td>
                                                                            <td className="py-3 pr-4 text-right">
                                                                                <button
                                                                                    onClick={() => handleDelete(log.id)}
                                                                                    disabled={isDeleting && deletingId === log.id}
                                                                                    className="text-xs text-error-500 hover:text-error-600 disabled:opacity-40"
                                                                                >
                                                                                    {isDeleting && deletingId === log.id ? 'Deleting...' : 'Delete'}
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {hasMore && (
                                        <button
                                            onClick={() => setVisibleLogs(prev => prev + 3)}
                                            className="mt-4 w-full text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium py-2"
                                        >
                                            Show older ({allGrouped.length - visibleLogs} more)
                                        </button>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
                {/* Log Form */}
                <div className="col-span-12 xl:col-span-5 flex flex-col gap-4 md:gap-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Log a Set</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Record an exercise — one entry per set.
                            </p>
                        </div>

                        {submitMessage && (
                            <div className="mb-4">
                                <Alert variant="success" title="Success" message={submitMessage} />
                            </div>
                        )}
                        {submitError && (
                            <div className="mb-4">
                                <Alert variant="error" title="Error" message={submitError} />
                            </div>
                        )}

                        <Form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="exercise">Exercise</Label>
                                <Input
                                    id="exercise"
                                    type="text"
                                    value={form.exercise}
                                    onChange={(e) => onChange('exercise', e.target.value)}
                                    placeholder="e.g. Bench Press"
                                    error={Boolean(errors.exercise)}
                                    hint={errors.exercise}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="sets">Sets</Label>
                                    <Input
                                        id="sets"
                                        type="number"
                                        min="1"
                                        step={1}
                                        value={form.sets}
                                        onChange={(e) => onChange('sets', e.target.value)}
                                        placeholder="e.g. 3"
                                        error={Boolean(errors.sets)}
                                        hint={errors.sets}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="reps">Reps</Label>
                                    <Input
                                        id="reps"
                                        type="number"
                                        min="1"
                                        step={1}
                                        value={form.reps}
                                        onChange={(e) => onChange('reps', e.target.value)}
                                        placeholder="e.g. 8"
                                        error={Boolean(errors.reps)}
                                        hint={errors.reps}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                                    <Input
                                        id="weight_kg"
                                        type="number"
                                        min="0.1"
                                        step={0.1}
                                        value={form.weight_kg}
                                        onChange={(e) => onChange('weight_kg', e.target.value)}
                                        placeholder="e.g. 80"
                                        error={Boolean(errors.weight_kg)}
                                        hint={errors.weight_kg}
                                    />
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button disabled={isCreating}>
                                    {isCreating ? 'Logging...' : 'Log Set'}
                                </Button>
                            </div>
                        </Form>
                    </div>

                    <Metrics />
                    <Macros />
                </div>
            </div>
        </>
    );
}
