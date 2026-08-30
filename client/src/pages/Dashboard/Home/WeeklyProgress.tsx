import { useMemo } from 'react';
import { Utensils, Dumbbell, Scale, TrendingDown } from 'lucide-react';
import { Link } from 'react-router';
import { useWorkoutLogs } from '../../../hooks/useWorkoutLogs';
import { useWeightLogs } from '../../../hooks/useWeightLogs';
import { useNutritionLogs } from '../../../hooks/useNutritionLogs';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';

const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

function toLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function WeeklyProgress() {
    const { workoutLogs } = useWorkoutLogs();
    const { weightLogs } = useWeightLogs();
    const { nutritionLogs } = useNutritionLogs();
    const { fitnessMetrics } = useFitnessMetrics();
    const calorieTarget = fitnessMetrics?.caloriesTarget ?? null;

    const last7Days = useMemo(() => {
        const days: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(toLocalDate(d));
        }
        return days;
    }, []);

    const dayLabels = useMemo(() => last7Days.map(day => {
        const d = new Date(day + 'T12:00:00');
        return DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
    }), [last7Days]);

    const caloriesByDay = useMemo(() => {
        return last7Days.map(day => {
            const total = nutritionLogs
                .filter(l => l.logged_at?.slice(0, 10) === day)
                .reduce((s, l) => s + l.calories, 0);
            return { day, total };
        });
    }, [nutritionLogs, last7Days]);

    const avgCalories = useMemo(() => {
        const days = caloriesByDay.filter(d => d.total > 0);
        if (days.length === 0) return 0;
        return Math.round(days.reduce((s, d) => s + d.total, 0) / days.length);
    }, [caloriesByDay]);

    const workoutDaysThisWeek = useMemo(() => {
        const days = new Set(
            workoutLogs
                .filter(l => last7Days.includes(toLocalDate(new Date(l.created_at))))
                .map(l => toLocalDate(new Date(l.created_at)))
        );
        return days.size;
    }, [workoutLogs, last7Days]);

    const weightDelta = useMemo(() => {
        if (weightLogs.length < 2) return null;
        const sorted = [...weightLogs].sort((a, b) =>
            new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
        );
        const latest = sorted[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const old = sorted.find(l => new Date(l.measured_at) <= weekAgo);
        if (!old) return null;
        return +(latest.weight_kg - old.weight_kg).toFixed(1);
    }, [weightLogs]);

    const maxCal = Math.max(calorieTarget ?? 0, ...caloriesByDay.map(d => d.total), 1);

    return (
        <>

            {/* Calorii săptămână */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-brand-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calorii săptămână</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                            {avgCalories > 0 ? `${avgCalories} kcal/zi` : '—'}
                            {calorieTarget && avgCalories > 0 && (
                                <span className="text-xs font-normal text-gray-400 ml-1">/ {Math.round(calorieTarget)}</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    {caloriesByDay.map((d, i) => {
                        const pct = d.total > 0 ? Math.min((d.total / maxCal) * 100, 100) : 0;
                        const isToday = i === 6;
                        const overTarget = calorieTarget && d.total > calorieTarget;
                        return (
                            <div key={d.day} className="flex items-center gap-2">
                                <span className={`text-[11px] w-5 shrink-0 ${isToday ? 'text-brand-500 font-bold' : 'text-gray-400'}`}>
                                    {dayLabels[i]}
                                </span>
                                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${d.total === 0 ? '' : overTarget ? 'bg-error-500' : isToday ? 'bg-brand-500' : 'bg-brand-300 dark:bg-brand-500/60'}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className={`text-[11px] w-14 text-right shrink-0 ${d.total === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {d.total > 0 ? `${d.total} kcal` : '—'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Antrenamente săptămână */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-success-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Antrenamente săptămână</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                            {workoutDaysThisWeek} <span className="text-xs font-normal text-gray-400">/ 7 zile</span>
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    {last7Days.map((day, i) => {
                        const hasWorkout = workoutLogs.some(
                            l => toLocalDate(new Date(l.created_at)) === day
                        );
                        const isToday = i === 6;
                        return (
                            <div key={day} className="flex items-center gap-2">
                                <span className={`text-[11px] w-5 shrink-0 ${isToday ? 'text-brand-500 font-bold' : 'text-gray-400'}`}>
                                    {dayLabels[i]}
                                </span>
                                <div className={`flex-1 h-4 rounded-full ${hasWorkout ? 'bg-success-500' : 'bg-gray-100 dark:bg-gray-800'}`} />
                                <span className={`text-[11px] w-14 text-right shrink-0 ${hasWorkout ? 'text-success-600 dark:text-success-400 font-medium' : 'text-gray-300 dark:text-gray-600'}`}>
                                    {hasWorkout ? 'antrenat' : '—'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Evoluție greutate */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${weightDelta === null ? 'bg-gray-50 dark:bg-gray-800' :
                        weightDelta < 0 ? 'bg-success-50 dark:bg-success-500/10' : 'bg-warning-50 dark:bg-warning-500/10'
                        }`}>
                        {weightDelta !== null && weightDelta < 0
                            ? <TrendingDown className="w-4 h-4 text-success-500" />
                            : <Scale className="w-4 h-4 text-warning-500" />
                        }
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Evoluție greutate (7 zile)</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                            {weightDelta === null ? '—' : (
                                <span className={weightDelta < 0 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}>
                                    {weightDelta > 0 ? '+' : ''}{weightDelta} kg
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {weightLogs.length > 0 ? (() => {
                    const latest = [...weightLogs].sort((a, b) =>
                        new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
                    )[0];
                    return (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-black text-gray-800 dark:text-white/90">{latest.weight_kg} <span className="text-sm font-normal text-gray-400">kg</span></p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(latest.measured_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                            <Link
                                to="/dashboard/weight-logs"
                                className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                            >
                                Vezi detalii →
                            </Link>
                        </div>
                    );
                })() : (
                    <p className="text-xs text-gray-400">Nicio greutate logată încă.</p>
                )}
            </div>
        </>
    );
}
