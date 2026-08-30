import { useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import PageMeta from '../../../components/common/PageMeta';
import Form from '../../../components/form/Form';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Alert from '../../../components/ui/alert/Alert';
import Button from '../../../components/ui/button/Button';
import { useWeightLogs } from '../../../hooks/useWeightLogs';
import { useAutoDismiss } from '../../../hooks/useAutoDismiss';

type FormState = {
    weight_kg: string;
    note: string;
    measured_at: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const todayIso = () => new Date().toISOString().slice(0, 10);

function validate(values: FormState): FormErrors {
    const errors: FormErrors = {};
    const weight = Number.parseFloat(values.weight_kg);
    if (!values.weight_kg || Number.isNaN(weight)) {
        errors.weight_kg = 'Weight is required';
    } else if (weight <= 0 || weight > 500) {
        errors.weight_kg = 'Weight must be between 0.1 and 500 kg';
    }
    if (values.measured_at && values.measured_at > todayIso()) {
        errors.measured_at = 'Date cannot be in the future';
    }
    return errors;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
};

export default function WeightLogs() {
    const { weightLogs, isPending, isCreating, isDeleting, addWeightLog, removeWeightLog } = useWeightLogs();
    const [form, setForm] = useState<FormState>({ weight_kg: '', note: '', measured_at: todayIso() });
    const [errors, setErrors] = useState<FormErrors>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();

    const onChange = <K extends keyof FormState>(key: K, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleSubmit = () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        addWeightLog(
            {
                weight_kg: Number.parseFloat(form.weight_kg),
                note: form.note.trim() || undefined,
                measured_at: form.measured_at || undefined,
            },
            {
                onSuccess: () => {
                    setSubmitMessage('Weight logged successfully.');
                    setForm({ weight_kg: '', note: '', measured_at: todayIso() });
                },
                onError: (err: unknown) => setSubmitError(getErrorMessage(err)),
            },
        );
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        removeWeightLog(id, {
            onSuccess: () => setDeletingId(null),
            onError: (err: unknown) => {
                setDeletingId(null);
                setSubmitError(getErrorMessage(err));
            },
        });
    };

    const chartOptions: ApexOptions = {
        chart: {
            fontFamily: 'Outfit, sans-serif',
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ['#465FFF'],
        stroke: { curve: 'smooth', width: 2 },
        markers: {
            size: 3,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: { size: 5 },
        },
        grid: {
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: 'category',
            categories: weightLogs.map((l) => new Date(l.measured_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { fontSize: '12px', colors: ['#6B7280'] },
                formatter: (v: number) => `${v} kg`,
            },
        },
        tooltip: {
            y: { formatter: (v: number) => `${v} kg` },
        },
        legend: { show: false },
    };

    return (
        <>
            <PageMeta title="Weight Log" description="Track your body weight over time" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Log form */}
                <div className="col-span-12 xl:col-span-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <h2 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                            Log Weight
                        </h2>
                        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                            Record today's body weight.
                        </p>

                        {submitMessage && (
                            <div className="mb-4">
                                <Alert variant="success" title="Success" message={submitMessage} />
                            </div>
                        )}

                        <Form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="weight_kg">Weight (kg)</Label>
                                <Input
                                    id="weight_kg"
                                    type="number"
                                    min="0.1"
                                    step={0.1}
                                    value={form.weight_kg}
                                    onChange={(e) => onChange('weight_kg', e.target.value)}
                                    placeholder="e.g. 80.5"
                                    error={Boolean(errors.weight_kg)}
                                    hint={errors.weight_kg}
                                />
                            </div>

                            <div>
                                <Label htmlFor="measured_at">Date</Label>
                                <Input
                                    id="measured_at"
                                    type="date"
                                    value={form.measured_at}
                                    onChange={(e) => onChange('measured_at', e.target.value)}
                                    error={Boolean(errors.measured_at)}
                                    hint={errors.measured_at}
                                />
                            </div>

                            <div>
                                <Label htmlFor="note">Note (optional)</Label>
                                <Input
                                    id="note"
                                    type="text"
                                    value={form.note}
                                    onChange={(e) => onChange('note', e.target.value)}
                                    placeholder="e.g. After morning workout"
                                />
                            </div>

                            <div className="pt-1">
                                <Button disabled={isCreating}>
                                    {isCreating ? 'Logging...' : 'Log Weight'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Chart */}
                <div className="xl:col-span-6 col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <h2 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                            Weight Over Time
                        </h2>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            Your body weight history
                        </p>
                        {isPending && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                        )}
                        {!isPending && weightLogs.length < 2 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Log at least 2 entries to see your weight trend.
                            </p>
                        )}
                        {!isPending && weightLogs.length >= 2 && (
                            <Chart
                                options={chartOptions}
                                series={[{ name: 'Weight', data: weightLogs.map((l) => l.weight_kg) }]}
                                type="line"
                                height="300"
                            />
                        )}
                    </div>
                </div>

                {/* History table */}
                <div className="col-span-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                            Log History
                        </h2>

                        {submitError && (
                            <div className="mb-4">
                                <Alert variant="error" title="Error" message={submitError} />
                            </div>
                        )}

                        {isPending && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                        )}

                        {!isPending && weightLogs.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No entries yet. Log your first weight below.
                            </p>
                        )}

                        {!isPending && weightLogs.length > 0 && (
                            <div className="overflow-x-auto ">
                                <table className="w-full text-sm text-left ">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 dark:text-gray-500">
                                            <th className="pb-3 pt-2 pr-4 font-medium">Date</th>
                                            <th className="pb-3 pt-2 pr-4 font-medium">Weight</th>
                                            <th className="pb-3 pt-2 pr-4 font-medium">Note</th>
                                            <th className="pb-3 pt-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 ">
                                        {[...weightLogs].reverse().map((log) => (
                                            <tr key={log.id} className="text-gray-700 dark:text-gray-300">
                                                <td className="py-3 pr-4">
                                                    {new Date(log.measured_at).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td className="py-3 pr-4 font-medium text-gray-800 dark:text-white/90">
                                                    {log.weight_kg} kg
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                                                    {log.note ?? '—'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        disabled={isDeleting && deletingId === log.id}
                                                        className="text-xs text-error-500 hover:text-error-600 disabled:opacity-40"
                                                    >
                                                        {isDeleting && deletingId === log.id
                                                            ? 'Deleting...'
                                                            : 'Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
