import { useMemo, useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Form from '../../../components/form/Form';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Alert from '../../../components/ui/alert/Alert';
import Button from '../../../components/ui/button/Button';
import { useNutritionLogs } from '../../../hooks/useNutritionLogs';
import { useFitnessMetrics } from '../../../hooks/useFitnessMetrics';
import { useAutoDismiss } from '../../../hooks/useAutoDismiss';
import type { MealType } from '../../../services/nutrition-logs';

type FormState = {
    food_item: string;
    meal_type: MealType | '';
    calories: string;
    protein_g: string;
    carbs_g: string;
    fat_g: string;
    serving_g: string;
    note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const todayIso = () => new Date().toISOString().slice(0, 10);

const MEAL_TYPES: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
];

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function validate(values: FormState): FormErrors {
    const errors: FormErrors = {};
    if (!values.food_item.trim()) errors.food_item = 'Food item is required';
    const cal = Number.parseFloat(values.calories);
    if (!values.calories || Number.isNaN(cal) || cal <= 0) {
        errors.calories = 'Calories are required and must be > 0';
    }
    const checkOptionalMacro = (key: keyof FormState, label: string) => {
        if (values[key]) {
            const v = Number.parseFloat(values[key] as string);
            if (Number.isNaN(v) || v < 0) errors[key] = `${label} must be ≥ 0`;
        }
    };
    checkOptionalMacro('protein_g', 'Protein');
    checkOptionalMacro('carbs_g', 'Carbs');
    checkOptionalMacro('fat_g', 'Fat');
    return errors;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
};

const initialForm: FormState = {
    food_item: '',
    meal_type: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    serving_g: '',
    note: '',
};

export default function NutritionLogs() {
    const [selectedDate, setSelectedDate] = useState(todayIso());
    const { nutritionLogs, isPending, isCreating, isUpdating, isDeleting, addNutritionLog, updateNutritionLog, removeNutritionLog } =
        useNutritionLogs(selectedDate);
    const { fitnessMetrics } = useFitnessMetrics();
    const calorieTarget = fitnessMetrics?.caloriesTarget ?? null;
    const macroTargets = fitnessMetrics?.macros ?? null;
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();

    const handleEdit = (log: (typeof nutritionLogs)[number]) => {
        setEditingId(log.id);
        setForm({
            food_item: log.food_item,
            meal_type: log.meal_type ?? '',
            calories: String(log.calories),
            protein_g: String(log.protein_g),
            carbs_g: String(log.carbs_g),
            fat_g: String(log.fat_g),
            serving_g: log.serving_g != null ? String(log.serving_g) : '',
            note: log.note ?? '',
        });
        setErrors({});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setErrors({});
    };

    const onChange = <K extends keyof FormState>(key: K, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    // Daily macro totals
    const totals = useMemo(() => {
        return nutritionLogs.reduce(
            (acc, l) => ({
                calories: acc.calories + l.calories,
                protein_g: acc.protein_g + l.protein_g,
                carbs_g: acc.carbs_g + l.carbs_g,
                fat_g: acc.fat_g + l.fat_g,
            }),
            { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
        );
    }, [nutritionLogs]);

    // Group by meal type
    const byMeal = useMemo(() => {
        const map = new Map<MealType | 'uncategorised', typeof nutritionLogs>();
        for (const log of nutritionLogs) {
            const key = log.meal_type ?? 'uncategorised';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(log);
        }
        return map;
    }, [nutritionLogs]);

    const orderedMeals = [
        ...MEAL_ORDER.filter((m) => byMeal.has(m)),
        ...(byMeal.has('uncategorised') ? (['uncategorised'] as const) : []),
    ];

    const handleSubmit = () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        addNutritionLog(
            {
                food_item: form.food_item.trim(),
                meal_type: form.meal_type || undefined,
                calories: Number.parseFloat(form.calories),
                protein_g: form.protein_g ? Number.parseFloat(form.protein_g) : undefined,
                carbs_g: form.carbs_g ? Number.parseFloat(form.carbs_g) : undefined,
                fat_g: form.fat_g ? Number.parseFloat(form.fat_g) : undefined,
                serving_g: form.serving_g ? Number.parseFloat(form.serving_g) : undefined,
                note: form.note.trim() || undefined,
                logged_at: selectedDate,
            },
            {
                onSuccess: () => {
                    setSubmitMessage('Entry logged successfully.');
                    setForm(initialForm);
                },
                onError: (err: unknown) => setSubmitError(getErrorMessage(err)),
            },
        );
    };

    const handleSaveEdit = () => {
        if (!editingId) return;
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        updateNutritionLog(
            {
                id: editingId,
                dto: {
                    food_item: form.food_item.trim(),
                    meal_type: (form.meal_type as MealType) || null,
                    calories: Number.parseFloat(form.calories),
                    protein_g: form.protein_g ? Number.parseFloat(form.protein_g) : 0,
                    carbs_g: form.carbs_g ? Number.parseFloat(form.carbs_g) : 0,
                    fat_g: form.fat_g ? Number.parseFloat(form.fat_g) : 0,
                    serving_g: form.serving_g ? Number.parseFloat(form.serving_g) : null,
                    note: form.note.trim() || null,
                },
            },
            {
                onSuccess: () => {
                    setSubmitMessage('Entry updated successfully.');
                    handleCancelEdit();
                },
                onError: (err: unknown) => setSubmitError(getErrorMessage(err)),
            },
        );
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        removeNutritionLog(id, {
            onSuccess: () => setDeletingId(null),
            onError: (err: unknown) => {
                setDeletingId(null);
                setSubmitError(getErrorMessage(err));
            },
        });
    };

    return (
        <>
            <PageMeta title="Nutrition Log" description="Track your daily food intake and macros" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* Daily macro summary */}
                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                                    Daily Summary
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    Totals for the selected day
                                </p>
                            </div>
                            <Input
                                id="date-picker"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                            {[
                                { label: 'Calories', consumed: Math.round(totals.calories), target: calorieTarget ? Math.round(calorieTarget) : null, unit: 'kcal' },
                                { label: 'Protein', consumed: Math.round(totals.protein_g), target: macroTargets ? Math.round(macroTargets.protein) : null, unit: 'g' },
                                { label: 'Carbs', consumed: Math.round(totals.carbs_g), target: macroTargets ? Math.round(macroTargets.carbs) : null, unit: 'g' },
                                { label: 'Fat', consumed: Math.round(totals.fat_g), target: macroTargets ? Math.round(macroTargets.fat) : null, unit: 'g' },
                            ].map(({ label, consumed, target, unit }) => {
                                const pct = target ? Math.min((consumed / target) * 100, 100) : null;
                                const exceeded = target !== null && consumed > target;
                                const diff = target !== null ? Math.abs(consumed - target) : 0;
                                return (
                                    <div key={label} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                            {target !== null && (
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${exceeded
                                                    ? 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400'
                                                    : 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400'
                                                    }`}>
                                                    {exceeded ? `+${diff} over` : `${diff} left`}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white/90 leading-none">
                                            {consumed}{' '}
                                            <span className="text-xs font-normal text-gray-400">{unit}</span>
                                            {target !== null && (
                                                <span className="text-sm font-normal text-gray-400"> / {target}</span>
                                            )}
                                        </p>
                                        {pct !== null && (
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${exceeded ? 'bg-error-500' : 'bg-success-500'
                                                        }`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Meal log table */}
                <div className="col-span-12 xl:col-span-7">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                            Food Entries
                        </h2>

                        {submitError && (
                            <div className="mb-4">
                                <Alert variant="error" title="Error" message={submitError} />
                            </div>
                        )}

                        {isPending && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                        )}

                        {!isPending && nutritionLogs.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No entries for this day. Log your first meal below.
                            </p>
                        )}

                        {!isPending && orderedMeals.length > 0 && (
                            <div className="space-y-5">
                                {orderedMeals.map((meal) => {
                                    const logs = byMeal.get(meal)!;
                                    const mealLabel =
                                        meal === 'uncategorised'
                                            ? 'Uncategorised'
                                            : meal.charAt(0).toUpperCase() + meal.slice(1);
                                    const mealTotal = logs.reduce((s, l) => s + l.calories, 0);
                                    return (
                                        <div key={meal}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    {mealLabel}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {Math.round(mealTotal)} kcal
                                                </span>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                                            <th className="pb-2 pr-4 font-medium">Food</th>
                                                            <th className="pb-2 pr-3 font-medium text-center">kcal</th>
                                                            <th className="pb-2 pr-3 font-medium text-center">P</th>
                                                            <th className="pb-2 pr-3 font-medium text-center">C</th>
                                                            <th className="pb-2 pr-3 font-medium text-center">F</th>
                                                            <th className="pb-2"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                        {logs.map((log) => (
                                                            <tr key={log.id} className="text-gray-700 dark:text-gray-300">
                                                                <td className="py-2.5 pr-4 font-medium text-gray-800 dark:text-white/90">
                                                                    {log.food_item}
                                                                    {log.serving_g && (
                                                                        <span className="ml-1 text-xs text-gray-400">
                                                                            {log.serving_g}g
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-2.5 pr-3 text-center">{Math.round(log.calories)}</td>
                                                                <td className="py-2.5 pr-3 text-center">{Math.round(log.protein_g)}g</td>
                                                                <td className="py-2.5 pr-3 text-center">{Math.round(log.carbs_g)}g</td>
                                                                <td className="py-2.5 pr-3 text-center">{Math.round(log.fat_g)}g</td>
                                                                <td className="py-2.5 text-right whitespace-nowrap">
                                                                    <button
                                                                        onClick={() => handleEdit(log)}
                                                                        disabled={editingId === log.id}
                                                                        className="mr-3 text-xs text-brand-500 hover:text-brand-600 disabled:opacity-40"
                                                                    >
                                                                        Edit
                                                                    </button>
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
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Log form */}
                <div className="col-span-12 xl:col-span-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                                {editingId ? 'Edit Entry' : 'Log Food'}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                            {editingId ? 'Update the details of the selected entry.' : 'Add a meal or snack entry.'}
                        </p>

                        {submitMessage && (
                            <div className="mb-4">
                                <Alert variant="success" title="Success" message={submitMessage} />
                            </div>
                        )}

                        <Form onSubmit={editingId ? handleSaveEdit : handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="food_item">Food item</Label>
                                <Input
                                    id="food_item"
                                    type="text"
                                    value={form.food_item}
                                    onChange={(e) => onChange('food_item', e.target.value)}
                                    placeholder="e.g. Chicken breast"
                                    error={Boolean(errors.food_item)}
                                    hint={errors.food_item}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="meal_type">Meal</Label>
                                    <select
                                        id="meal_type"
                                        value={form.meal_type}
                                        onChange={(e) => onChange('meal_type', e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                    >
                                        <option value="">Any</option>
                                        {MEAL_TYPES.map((m) => (
                                            <option key={m.value} value={m.value}>
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="serving_g">Serving (g)</Label>
                                    <Input
                                        id="serving_g"
                                        type="number"
                                        min="0.1"
                                        step={0.1}
                                        value={form.serving_g}
                                        onChange={(e) => onChange('serving_g', e.target.value)}
                                        placeholder="e.g. 150"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="calories">Calories (kcal)</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    min="1"
                                    step={1}
                                    value={form.calories}
                                    onChange={(e) => onChange('calories', e.target.value)}
                                    placeholder="e.g. 250"
                                    error={Boolean(errors.calories)}
                                    hint={errors.calories}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="protein_g">Protein (g)</Label>
                                    <Input
                                        id="protein_g"
                                        type="number"
                                        min="0"
                                        step={0.1}
                                        value={form.protein_g}
                                        onChange={(e) => onChange('protein_g', e.target.value)}
                                        placeholder="0"
                                        error={Boolean(errors.protein_g)}
                                        hint={errors.protein_g}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="carbs_g">Carbs (g)</Label>
                                    <Input
                                        id="carbs_g"
                                        type="number"
                                        min="0"
                                        step={0.1}
                                        value={form.carbs_g}
                                        onChange={(e) => onChange('carbs_g', e.target.value)}
                                        placeholder="0"
                                        error={Boolean(errors.carbs_g)}
                                        hint={errors.carbs_g}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fat_g">Fat (g)</Label>
                                    <Input
                                        id="fat_g"
                                        type="number"
                                        min="0"
                                        step={0.1}
                                        value={form.fat_g}
                                        onChange={(e) => onChange('fat_g', e.target.value)}
                                        placeholder="0"
                                        error={Boolean(errors.fat_g)}
                                        hint={errors.fat_g}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="note">Note (optional)</Label>
                                <Input
                                    id="note"
                                    type="text"
                                    value={form.note}
                                    onChange={(e) => onChange('note', e.target.value)}
                                    placeholder="e.g. Home cooked"
                                />
                            </div>

                            <div className="pt-1 flex gap-3">
                                <Button disabled={editingId ? isUpdating : isCreating}>
                                    {editingId
                                        ? (isUpdating ? 'Saving...' : 'Save Changes')
                                        : (isCreating ? 'Logging...' : 'Log Entry')}
                                </Button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
