import { useState } from 'react';
import { Shield, Plus, Trash2, ChevronLeft } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useAdmin } from '../../../hooks/useAdmin';
import { useUserAssignments } from '../../../hooks/useWorkoutAssignments';
import ExercisePicker from '../../../components/common/ExercisePicker';
import { BACKEND_URL } from '../../../helpers/constants';
import type { AdminUser } from '../../../services/admin';
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

// ── Add exercise form for a specific day ─────────────────────────────────────

interface AddExerciseFormProps {
    userId: string;
    day: DayOfWeek;
    onAdd: (dto: {
        user_id: string;
        exercise_id: string;
        name: string;
        body_part: string;
        equipment: string;
        day_of_week: DayOfWeek;
        sets?: number;
        reps?: number;
        weight_kg?: number;
        notes?: string;
    }) => void;
    isAdding: boolean;
}

function AddExerciseForm({ userId, day, onAdd, isAdding }: AddExerciseFormProps) {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseId, setExerciseId] = useState('');
    const [bodyPart, setBodyPart] = useState('');
    const [equipment, setEquipment] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const reset = () => {
        setExerciseName(''); setExerciseId(''); setBodyPart(''); setEquipment('');
        setSets(''); setReps(''); setWeightKg(''); setNotes(''); setError('');
    };

    const handleAdd = () => {
        setError('');
        if (!exerciseName.trim()) { setError('Pick an exercise first.'); return; }
        if (!exerciseId) { setError('Select an exercise from the dropdown.'); return; }
        onAdd({
            user_id: userId,
            exercise_id: exerciseId,
            name: exerciseName,
            body_part: bodyPart,
            equipment,
            day_of_week: day,
            sets: sets ? parseInt(sets, 10) : undefined,
            reps: reps ? parseInt(reps, 10) : undefined,
            weight_kg: weightKg ? parseFloat(weightKg) : undefined,
            notes: notes || undefined,
        });
        reset();
    };

    return (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2.5">
            <ExercisePicker
                value={exerciseName}
                onChange={setExerciseName}
                onSelect={(ex) => { setExerciseId(ex.id); setBodyPart(ex.bodyPart); setEquipment(ex.equipment); setExerciseName(ex.name); }}
                placeholder="Search exercise…"
            />
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Sets</label>
                    <input
                        type="number" min={1} value={sets} onChange={e => setSets(e.target.value)}
                        placeholder="e.g. 4"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2.5 py-1.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Reps</label>
                    <input
                        type="number" min={1} value={reps} onChange={e => setReps(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2.5 py-1.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Weight (kg)</label>
                    <input
                        type="number" min={0} step={0.5} value={weightKg} onChange={e => setWeightKg(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2.5 py-1.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>
            </div>
            <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Trainer notes (optional) — e.g. 90s rest, focus on form"
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2.5 py-1.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
            {error && <p className="text-xs text-error-500">{error}</p>}
            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
            >
                <Plus className="w-3.5 h-3.5" />
                {isAdding ? 'Adding…' : 'Add to plan'}
            </button>
        </div>
    );
}

// ── Single exercise row ───────────────────────────────────────────────────────

function ExerciseRow({ a, onRemove, isRemoving }: { a: WorkoutAssignment; onRemove: (id: string) => void; isRemoving: boolean }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2">
            <img src={gifUrl(a.exercise_id)} alt={a.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                    {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                </p>
                <p className="text-xs text-gray-400">{a.body_part} · {a.equipment}</p>
                <div className="flex flex-wrap gap-2 mt-0.5">
                    {a.sets && <span className="text-xs text-gray-500 dark:text-gray-400">{a.sets} sets</span>}
                    {a.reps && <span className="text-xs text-gray-500 dark:text-gray-400">× {a.reps} reps</span>}
                    {a.weight_kg && <span className="text-xs text-gray-500 dark:text-gray-400">@ {a.weight_kg} kg</span>}
                    {a.notes && <span className="text-xs text-brand-500 dark:text-brand-400 truncate">{a.notes}</span>}
                </div>
            </div>
            <button
                onClick={() => onRemove(a.id)}
                disabled={isRemoving}
                className="text-gray-400 hover:text-error-500 transition-colors disabled:opacity-40 shrink-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

// ── Assignment panel for a single user ───────────────────────────────────────

interface AssignmentPanelProps {
    user: AdminUser;
    onBack: () => void;
}

function AssignmentPanel({ user, onBack }: AssignmentPanelProps) {
    const { assignments, isPending, addAssignment, removeAssignment, isAdding, isRemoving } = useUserAssignments(user.id);
    const [activeDay, setActiveDay] = useState<DayOfWeek>('monday');
    const [showAddForm, setShowAddForm] = useState(false);

    const grouped = DAYS.reduce<Record<DayOfWeek, WorkoutAssignment[]>>((acc, { key }) => {
        acc[key] = assignments.filter(a => a.day_of_week === key);
        return acc;
    }, {} as Record<DayOfWeek, WorkoutAssignment[]>);

    const unscheduled = assignments.filter(a => !a.day_of_week);

    const handleAdd = (dto: Parameters<typeof addAssignment>[0]) => {
        addAssignment(dto, { onSuccess: () => setShowAddForm(false) });
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Back to users
            </button>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Weekly plan for <span className="text-brand-600 dark:text-brand-400">{user.email}</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Assign exercises per day of the week.
                </p>
            </div>

            {/* Day tabs */}
            <div className="flex gap-1 flex-wrap mb-5">
                {DAYS.map(({ key, short, label }) => {
                    const count = grouped[key].length;
                    return (
                        <button
                            key={key}
                            onClick={() => { setActiveDay(key); setShowAddForm(false); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative ${activeDay === key
                                ? 'bg-brand-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="hidden sm:inline">{label}</span>
                            <span className="inline sm:hidden">{short}</span>
                            {count > 0 && (
                                <span className={`ml-1.5 text-[10px] font-bold ${activeDay === key ? 'text-white/80' : 'text-brand-500'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Active day panel */}
            {isPending ? (
                <p className="text-sm text-gray-400">Loading…</p>
            ) : (
                <div className="space-y-2">
                    {grouped[activeDay].length === 0 && !showAddForm && (
                        <p className="text-sm text-gray-400 py-2">No exercises for {DAYS.find(d => d.key === activeDay)?.label}.</p>
                    )}
                    {grouped[activeDay].map(a => (
                        <ExerciseRow key={a.id} a={a} onRemove={removeAssignment} isRemoving={isRemoving} />
                    ))}

                    {showAddForm ? (
                        <AddExerciseForm
                            userId={user.id}
                            day={activeDay}
                            onAdd={handleAdd}
                            isAdding={isAdding}
                        />
                    ) : (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline mt-1"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add exercise to {DAYS.find(d => d.key === activeDay)?.label}
                        </button>
                    )}
                </div>
            )}

            {/* Unscheduled */}
            {unscheduled.length > 0 && (
                <div className="mt-8">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Unscheduled</p>
                    <div className="space-y-2">
                        {unscheduled.map(a => (
                            <ExerciseRow key={a.id} a={a} onRemove={removeAssignment} isRemoving={isRemoving} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main admin page ───────────────────────────────────────────────────────────

export default function AdminPage() {
    const { users, isPending, error, isUpdating, changeRole } = useAdmin();
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    if (error) {
        return (
            <>
                <PageMeta title="Admin" description="User management" />
                <div className="rounded-2xl border border-error-200 bg-error-50 dark:bg-error-500/10 p-8 flex flex-col items-center text-center">
                    <Shield className="w-10 h-10 text-error-400 mb-3" />
                    <p className="text-sm font-medium text-error-600 dark:text-error-400">
                        Access denied — admin role required.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Admin — User Management" description="Manage user roles and exercise plans" />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                {selectedUser ? (
                    <AssignmentPanel user={selectedUser} onBack={() => setSelectedUser(null)} />
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">User Management</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage roles and assign weekly exercise plans to users.
                            </p>
                        </div>

                        {isPending && <p className="text-sm text-gray-500 dark:text-gray-400">Loading users…</p>}
                        {!isPending && users.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No users found.</p>
                        )}

                        {!isPending && users.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                            <th className="pb-3 font-medium">Email</th>
                                            <th className="pb-3 pr-4 font-medium text-center">Role</th>
                                            <th className="pb-3 pr-4 font-medium text-center">Joined</th>
                                            <th className="pb-3 pr-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {users.map(user => (
                                            <tr key={user.id} className="text-gray-700 dark:text-gray-300">
                                                <td className="py-3 font-medium text-gray-800 dark:text-white/90">{user.email}</td>
                                                <td className="py-3 pr-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        user.role === 'admin'
                                                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-center text-gray-400 dark:text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-3 pr-4 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                                                        >
                                                            Manage Plan
                                                        </button>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => changeRole({ id: user.id, role: user.role === 'admin' ? 'user' : 'admin' })}
                                                            className="text-xs text-gray-500 dark:text-gray-400 hover:underline disabled:opacity-40"
                                                        >
                                                            {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
