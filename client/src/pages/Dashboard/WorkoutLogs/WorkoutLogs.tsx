import { useState, useMemo, useEffect, useRef } from 'react';
import { Download, ChevronDown, Dumbbell } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import Form from '../../../components/form/Form';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Button from '../../../components/ui/button/Button';
import Alert from '../../../components/ui/alert/Alert';
import { useWorkoutLogs } from '../../../hooks/useWorkoutLogs';
import { useMyAssignments } from '../../../hooks/useWorkoutAssignments';
import { useAutoDismiss } from '../../../hooks/useAutoDismiss';
import type { CreateWorkoutLogDto, WorkoutLog } from '../../../services/workout-logs';
import type { WorkoutAssignment, DayOfWeek } from '../../../services/workout-assignments';
import { validateWorkoutLog } from './workoutLogs.validation';
import type { WorkoutLogFormState as FormState, WorkoutLogFormErrors as FormErrors } from './workoutLogs.validation';
import useDebounce from '../../../hooks/useDebounce';
import WorkingWeightGuidance from './WorkingWeightGuidance';
import WorkoutTrendCharts from './WorkoutTrendCharts';
import { useAppContext } from '../../../context/AppContext';
import { exportWorkoutCsv } from '../../../services/personal-records';

const DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABEL: Record<DayOfWeek, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

function PlanExercisePicker({
    value,
    onSelect,
    error,
}: {
    value: string;
    onSelect: (assignment: WorkoutAssignment) => void;
    error?: string;
}) {
    const { assignments, isPending } = useMyAssignments();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const grouped = useMemo(() => {
        const byDay = new Map<DayOfWeek | 'unscheduled', WorkoutAssignment[]>();
        for (const day of DAY_ORDER) byDay.set(day, []);
        byDay.set('unscheduled', []);
        for (const a of assignments) {
            const key = a.day_of_week ?? 'unscheduled';
            byDay.get(key)!.push(a);
        }
        return byDay;
    }, [assignments]);

    const hasAssignments = assignments.length > 0;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`h-11 w-full flex items-center justify-between rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20
                    ${error ? 'border-error-400' : 'border-gray-300 dark:border-gray-700'}
                    bg-transparent text-left ${value ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}
            >
                <span className="truncate">{value || 'Select exercise from your plan…'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                    {isPending && <p className="px-3 py-3 text-sm text-gray-400">Loading your plan…</p>}
                    {!isPending && !hasAssignments && (
                        <div className="px-3 py-4 flex flex-col items-center text-center gap-1">
                            <Dumbbell className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                            <p className="text-sm text-gray-400">No exercises assigned yet.</p>
                            <p className="text-xs text-gray-400">Contact your trainer to get a plan.</p>
                        </div>
                    )}
                    {!isPending && hasAssignments && (
                        <>
                            {DAY_ORDER.map(day => {
                                const items = grouped.get(day) ?? [];
                                if (items.length === 0) return null;
                                return (
                                    <div key={day}>
                                        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                            {DAY_LABEL[day]}
                                        </p>
                                        {items.map(a => (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onMouseDown={e => { e.preventDefault(); onSelect(a); setOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                        {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {a.body_part} · {a.equipment}
                                                        {a.sets && ` · ${a.sets}×${a.reps ?? '?'}`}
                                                        {a.weight_kg && ` @ ${a.weight_kg}kg`}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                            {(grouped.get('unscheduled') ?? []).length > 0 && (
                                <div>
                                    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                        Unscheduled
                                    </p>
                                    {(grouped.get('unscheduled') ?? []).map(a => (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onMouseDown={e => { e.preventDefault(); onSelect(a); setOpen(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                    {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {a.body_part} · {a.equipment}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

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
    const { session } = useAppContext();
    const [visibleLogs, setVisibleLogs] = useState(3);
    const [form, setForm] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [openDays, setOpenDays] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState("");
    const [latestLog, setLatestLog] = useState<WorkoutLog | null>(null);
    const [exporting, setExporting] = useState(false);

    const debouncedQuery = useDebounce(query, 400);

    const filteredLogs = useMemo(() => {
        if (!debouncedQuery) return workoutLogs;

        const q = debouncedQuery.toLowerCase();
        return workoutLogs
            .filter(log => log.exercise.toLowerCase().includes(q))
            .sort((a, b) => {
                // Exercises that START with the query rank before those that just contain it
                const aStarts = a.exercise.toLowerCase().startsWith(q) ? 0 : 1;
                const bStarts = b.exercise.toLowerCase().startsWith(q) ? 0 : 1;
                return aStarts - bStarts;
            });
    }, [workoutLogs, debouncedQuery]);

    useEffect(() => {
        if (workoutLogs.length === 0) return undefined;

        const currentLog = workoutLogs.reduce((latest, current) => (
            new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest
        ));

        if (currentLog) setLatestLog(currentLog)

    }, [workoutLogs])

    // const latestLog = useMemo(() => {
    //     if (workoutLogs.length === 0) return undefined;

    //     const getLatestLogs = workoutLogs.reduce((latest, current) => (
    //         new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest
    //     ));

    //     console.log(getLatestLogs);

    //     return getLatestLogs
    // }, [workoutLogs]);

    const allGrouped = groupByDate(filteredLogs);
    // While searching, show all matching days; otherwise paginate
    const grouped = debouncedQuery ? allGrouped : allGrouped.slice(0, visibleLogs);
    const hasMore = !debouncedQuery && allGrouped.length > visibleLogs;

    // When search query changes, reset manual toggles so the first result auto-opens
    useEffect(() => {
        setOpenDays(new Set());
    }, [debouncedQuery]);

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

    const handleGetLatestWork = (log: WorkoutLog) => {
        setLatestLog(log);
    };

    const handleExport = async () => {
        if (!session?.access_token) return;
        setExporting(true);
        try { await exportWorkoutCsv(session.access_token); }
        catch (e) { setSubmitError(e instanceof Error ? e.message : 'Export failed'); }
        finally { setExporting(false); }
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
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Workout History</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    1RM and working weight are calculated from your training goal.
                                </p>
                            </div>
                            {workoutLogs.length > 0 && (
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                    {exporting ? 'Exporting…' : 'Export CSV'}
                                </button>
                            )}
                        </div>

                        {isPending && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading logs...</p>
                        )}

                        {!isPending && workoutLogs.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No workouts logged yet.</p>
                        )}

                        {!isPending && workoutLogs.length > 0 && (
                            <div className="mb-5">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    placeholder="Search exercise..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 dark:focus:border-brand-800 transition"
                                />
                            </div>
                        )}

                        {!isPending && workoutLogs.length > 0 && grouped.length === 0 && (
                            <p className="text-sm text-gray-400">No exercises match &ldquo;{query}&rdquo;.</p>
                        )}

                        {!isPending && grouped.length > 0 && (
                            <>
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
                                                                <thead >
                                                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                                                        <th className="px-4 pb-3 pt-2 font-medium">Exercise</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Sets</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Reps</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center">Weight</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Greutatea maximă estimată pentru o singură repetare (formula Epley)">1RM ⓘ</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Greutatea recomandată de antrenament bazată pe 1RM și obiectivul tău">Working wt. ⓘ</th>
                                                                        <th className="pb-3 pt-2 pr-4 font-medium text-center" title="Volum total = seturi x repetări x greutate">Volume ⓘ</th>
                                                                        <th className="pb-3 pt-2"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                                    {logs.map((log) => (
                                                                        <tr key={log.id} className="text-gray-700 dark:text-gray-300" onClick={() => handleGetLatestWork(log)}>
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
                        )}
                    </div>
                </div>
                {/* Log Form */}
                <div className="col-span-12 xl:col-span-5 flex flex-col gap-4 md:gap-6">
                    {(debouncedQuery ? filteredLogs[0] ?? latestLog : latestLog) && (
                        <WorkingWeightGuidance latestLog={(debouncedQuery ? filteredLogs[0] ?? latestLog : latestLog)!} />
                    )}

                    <div id="log-set-form" className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
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
                                <PlanExercisePicker
                                    value={form.exercise}
                                    error={errors.exercise}
                                    onSelect={(assignment) => {
                                        setForm(prev => ({
                                            ...prev,
                                            exercise: assignment.name.charAt(0).toUpperCase() + assignment.name.slice(1),
                                            sets: assignment.sets ? String(assignment.sets) : prev.sets,
                                            reps: assignment.reps ? String(assignment.reps) : prev.reps,
                                            weight_kg: assignment.weight_kg ? String(assignment.weight_kg) : prev.weight_kg,
                                        }));
                                        setErrors(prev => ({ ...prev, exercise: undefined }));
                                    }}
                                />
                                {errors.exercise && (
                                    <p className="mt-1 text-xs text-error-500">{errors.exercise}</p>
                                )}
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
                </div>

                {/* Trend charts - full width below */}
                {!isPending && workoutLogs.length > 0 && (
                    <WorkoutTrendCharts workoutLogs={workoutLogs} />
                )}
            </div>
        </>
    );
}
