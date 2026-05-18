import { useState } from 'react';
import { Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useMyAssignments } from '../../../hooks/useWorkoutAssignments';
import { BACKEND_URL } from '../../../helpers/constants';
import type { DayOfWeek, WorkoutAssignment } from '../../../services/workout-assignments';

const gifUrl = (id: string) => `${BACKEND_URL}/exercises/gif/${id}`;

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

function todayKey(): DayOfWeek {
    const idx = new Date().getDay(); // 0=Sun
    const map: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return map[idx];
}

function ExerciseCard({ a }: { a: WorkoutAssignment }) {
    const [open, setOpen] = useState(false);
    
    return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors text-left"
            >
                <img
                    src={gifUrl(a.exercise_id)}
                    alt={a.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
                        {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {a.body_part} · {a.equipment}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {(a.sets || a.reps) && (
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                            {a.sets && `${a.sets}×`}{a.reps && `${a.reps}`}
                            {a.weight_kg ? ` @ ${a.weight_kg}kg` : ''}
                        </span>
                    )}
                    {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
            </button>

            {open && (
                <div className="px-4 py-4 flex gap-4 items-start">
                    <img
                        src={gifUrl(a.exercise_id)}
                        alt={a.name}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 shrink-0"
                    />
                    <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                {a.body_part}
                            </span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                {a.equipment}
                            </span>
                            {a.sets && (
                                <span className="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                                    {a.sets} sets
                                </span>
                            )}
                            {a.reps && (
                                <span className="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                                    {a.reps} reps
                                </span>
                            )}
                            {a.weight_kg && (
                                <span className="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                                    {a.weight_kg} kg
                                </span>
                            )}
                        </div>
                        {a.notes && (
                            <div className="rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800/50 px-3 py-2">
                                <p className="text-xs font-medium text-brand-700 dark:text-brand-300 mb-0.5">Trainer notes</p>
                                <p className="text-sm text-brand-600 dark:text-brand-400">{a.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MyPlanPage() {
    const { assignments, isPending } = useMyAssignments();
    const [activeDay, setActiveDay] = useState<DayOfWeek>(todayKey);

    const grouped = DAYS.reduce<Record<DayOfWeek, WorkoutAssignment[]>>((acc, { key }) => {
        acc[key] = assignments.filter(a => a.day_of_week === key);
        return acc;
    }, {} as Record<DayOfWeek, WorkoutAssignment[]>);

    const unscheduled = assignments.filter(a => !a.day_of_week);
    const today = todayKey();

    return (
        <>
            <PageMeta title="My Plan" description="Exercises assigned to you by your trainer" />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">My Weekly Plan</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Exercises assigned to you by your trainer.
                    </p>
                </div>

                {isPending && <p className="text-sm text-gray-500 dark:text-gray-400">Loading your plan…</p>}

                {!isPending && assignments.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-gray-400">
                        <Dumbbell className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">No exercises assigned yet. Check back soon.</p>
                    </div>
                )}

                {!isPending && assignments.length > 0 && (
                    <>
                        {/* Day tabs */}
                        <div className="flex gap-1 flex-wrap mb-6">
                            {DAYS.map(({ key, label, short }) => {
                                const count = grouped[key].length;
                                const isToday = key === today;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveDay(key)}
                                        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeDay === key
                                            ? 'bg-brand-500 text-white'
                                            : isToday
                                                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-300 dark:ring-brand-700'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="inline sm:hidden">{short}</span>
                                        {isToday && activeDay !== key && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full" />
                                        )}
                                        {count > 0 && (
                                            <span className={`ml-1.5 text-[10px] font-bold ${activeDay === key ? 'text-white/80' : 'text-brand-500'}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active day exercises */}
                        <div className="space-y-2">
                            {grouped[activeDay].length === 0 ? (
                                <div className="flex flex-col items-center py-10 text-gray-400">
                                    <Dumbbell className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm">Rest day — no exercises scheduled for {DAYS.find(d => d.key === activeDay)?.label}.</p>
                                </div>
                            ) : (
                                grouped[activeDay].map((a, idx) => (
                                    <div key={a.id} className="flex gap-3 items-start">
                                        <span className="text-xs font-semibold text-gray-400 w-5 pt-3.5 shrink-0">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <ExerciseCard a={a} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Unscheduled */}
                        {unscheduled.length > 0 && (
                            <div className="mt-8">
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Unscheduled exercises</p>
                                <div className="space-y-2">
                                    {unscheduled.map((a, idx) => (
                                        <div key={a.id} className="flex gap-3 items-start">
                                            <span className="text-xs font-semibold text-gray-400 w-5 pt-3.5 shrink-0">{idx + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <ExerciseCard a={a} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
