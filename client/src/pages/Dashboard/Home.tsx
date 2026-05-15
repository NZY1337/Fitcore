import { useMemo } from 'react';
import { Flame, Users, ClipboardList, UserCheck, TrendingUp, Dumbbell, Shield } from 'lucide-react';
import { Link } from 'react-router';
import FitnessMetrics from "../../components/ecommerce/FitnessMetrics/FitnessMetrics";
import GoalSummaryBanner from "../../components/ecommerce/GoalSummaryBanner";
import PageMeta from "../../components/common/PageMeta";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import { useWorkoutLogs } from '../../hooks/useWorkoutLogs';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useAdminStats } from '../../hooks/useAdmin';

// ── Streak helper ─────────────────────────────────────────────────────────────

function computeStreak(logs: { created_at: string }[]): number {
    if (logs.length === 0) return 0;
    const days = new Set(logs.map(l => new Date(l.created_at).toDateString()));
    const cursor = new Date();
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(cursor.toDateString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    sub?: string;
    color?: string;
}

function StatCard({ icon, label, value, sub, color = 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ── Admin dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
    const { stats, isPending } = useAdminStats();

    return (
        <>
            <PageMeta title="Admin Dashboard" description="Platform overview and statistics." />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform overview — all numbers update every minute.</p>
            </div>

            {isPending ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 h-24 animate-pulse" />
                    ))}
                </div>
            ) : stats ? (
                <>
                    {/* Primary stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={<Users className="w-5 h-5" />}
                            label="Total Users"
                            value={stats.totalUsers}
                            sub={`${stats.adminCount} admin · ${stats.userCount} user`}
                            color="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        />
                        <StatCard
                            icon={<TrendingUp className="w-5 h-5" />}
                            label="New (last 7 days)"
                            value={stats.newLast7Days}
                            sub={`${stats.newLast30Days} in last 30 days`}
                            color="bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400"
                        />
                        <StatCard
                            icon={<ClipboardList className="w-5 h-5" />}
                            label="Total Assignments"
                            value={stats.totalAssignments}
                            sub="across all users"
                            color="bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400"
                        />
                        <StatCard
                            icon={<UserCheck className="w-5 h-5" />}
                            label="Users with a Plan"
                            value={stats.usersWithPlan}
                            sub={stats.totalUsers > 0 ? `${Math.round((stats.usersWithPlan / stats.userCount) * 100)}% of users` : '—'}
                            color="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Top exercises */}
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Dumbbell className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Most Assigned Exercises</h2>
                            </div>
                            {stats.topExercises.length === 0 ? (
                                <p className="text-sm text-gray-400">No assignments yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {stats.topExercises.map((ex, i) => (
                                        <div key={ex.name} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 dark:text-white/90 truncate">
                                                    {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
                                                </p>
                                                <div className="mt-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-brand-500 rounded-full"
                                                        style={{ width: `${Math.round((ex.count / stats.topExercises[0].count) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">{ex.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Actions</h2>
                            </div>
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard/admin"
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                                >
                                    <Users className="w-4 h-4 text-brand-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">Manage Users</p>
                                        <p className="text-xs text-gray-400">Assign plans, change roles</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/dashboard/exercises"
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                                >
                                    <Dumbbell className="w-4 h-4 text-brand-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">Browse Exercises</p>
                                        <p className="text-xs text-gray-400">Search the full exercise library</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

// ── User dashboard ────────────────────────────────────────────────────────────

function UserDashboard() {
    const { workoutLogs } = useWorkoutLogs();
    const streak = useMemo(() => computeStreak(workoutLogs), [workoutLogs]);

    return (
        <>
            <PageMeta
                title="Fitness Metrics - Dashboard"
                description="View your fitness metrics and track your progress over time on the dashboard."
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {streak > 0 && (
                    <div className="col-span-12">
                        <div className="flex items-center gap-3 rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-500/10 px-5 py-4">
                            <Flame className="w-6 h-6 text-orange-500 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                    {streak}-day workout streak!
                                </p>
                                <p className="text-xs text-orange-500 dark:text-orange-400">
                                    Keep it up — consistency is everything.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="col-span-6 space-y-6 xl:col-span-6">
                    <FitnessMetrics />
                </div>

                <div className="col-span-6">
                    <GoalSummaryBanner />
                    <div className="mt-5">
                        <MonthlyTarget />
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default function Home() {
    const { isAdmin, isPending } = useCurrentUser();

    if (isPending) return null;

    return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
