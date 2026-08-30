import { useEffect, useMemo, useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Form from '../../../components/form/Form';
import Input from '../../../components/form/input/InputField';
import TextArea from '../../../components/form/input/TextArea';
import Label from '../../../components/form/Label';
import Alert from '../../../components/ui/alert/Alert';
import Button from '../../../components/ui/button/Button';
import { useAutoDismiss } from '../../../hooks/useAutoDismiss';
import { useSettings } from '../../../hooks/useSettings';
import type { TrainingGoalKey } from '../../../services/settings';
import {
    createEmptyErrors,
    hasSettingsErrors,
    toFormState,
    toSettingsPayload,
    validateSettings,
    type GoalSettingsFormState,
    type SettingsFormErrors,
    type SettingsFormState,
} from './settings.validation';

const GOAL_LABELS: Record<TrainingGoalKey, string> = {
    strength: 'Strength',
    hypertrophy: 'Hypertrophy',
    endurance: 'Endurance',
};

const GOAL_DESCRIPTIONS: Record<TrainingGoalKey, string> = {
    strength: 'Configure heavy lifting guidance and progression for low-rep work.',
    hypertrophy: 'Configure muscle-building ranges and progression increments.',
    endurance: 'Configure higher-rep training guidance and lighter progression.',
};

const GOAL_KEYS: TrainingGoalKey[] = ['strength', 'hypertrophy', 'endurance'];

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
};

export default function Settings() {
    const { settings, isPending, error, isUpdating, updateSettings } = useSettings();
    const [form, setForm] = useState<SettingsFormState | null>(null);
    const [errors, setErrors] = useState<SettingsFormErrors>(createEmptyErrors());
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();

    useEffect(() => {
        if (!settings) return;
        setForm(toFormState(settings));
    }, [settings]);

    const hasLoadedForm = useMemo(() => form !== null, [form]);

    const onChange = <K extends keyof GoalSettingsFormState>(goal: TrainingGoalKey, key: K, value: GoalSettingsFormState[K]) => {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [goal]: {
                    ...prev[goal],
                    [key]: value,
                },
            };
        });

        if (errors[goal][key]) {
            setErrors((prev) => ({
                ...prev,
                [goal]: {
                    ...prev[goal],
                    [key]: undefined,
                },
            }));
        }

        if (submitError) setSubmitError('');
        if (submitMessage) setSubmitMessage('');
    };

    const handleSubmit = () => {
        if (!form) return;

        const nextErrors = validateSettings(form);
        setErrors(nextErrors);
        if (hasSettingsErrors(nextErrors)) return;

        updateSettings(toSettingsPayload(form), {
            onSuccess: (updatedSettings) => {
                setForm(toFormState(updatedSettings));
                setErrors(createEmptyErrors());
                setSubmitMessage('Settings updated successfully.');
            },
            onError: (mutationError: unknown) => setSubmitError(getErrorMessage(mutationError)),
        });
    };

    return (
        <>
            <PageMeta
                title="Training Settings"
                description="Adjust the training guidance rules that power workout recommendations."
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Training Settings</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                These values control working weight recommendations, target rep ranges, set ranges, and progression tips.
                            </p>
                        </div>

                        {isPending && (
                            <div className="mb-4">
                                <Alert
                                    variant="info"
                                    title="Loading settings"
                                    message="We are fetching your saved training settings."
                                />
                            </div>
                        )}

                        {error && (
                            <div className="mb-4">
                                <Alert
                                    variant="error"
                                    title="Unable to load settings"
                                    message={getErrorMessage(error)}
                                />
                            </div>
                        )}

                        {submitMessage && (
                            <div className="mb-4">
                                <Alert variant="success" title="Success" message={submitMessage} />
                            </div>
                        )}

                        {submitError && (
                            <div className="mb-4">
                                <Alert variant="error" title="Update failed" message={submitError} />
                            </div>
                        )}

                        {hasLoadedForm && form && (
                            <Form onSubmit={handleSubmit} className="space-y-6">
                                {GOAL_KEYS.map((goal) => (
                                    <div key={goal} className="rounded-2xl border border-gray-100 p-5 dark:border-gray-800">
                                        <div className="mb-5">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{GOAL_LABELS[goal]}</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{GOAL_DESCRIPTIONS[goal]}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
                                            <div>
                                                <Label htmlFor={`${goal}-workingWeightMultiplier`}>Working Weight Multiplier</Label>
                                                <Input
                                                    id={`${goal}-workingWeightMultiplier`}
                                                    type="number"
                                                    step={0.01}
                                                    min="0.01"
                                                    value={form[goal].workingWeightMultiplier}
                                                    onChange={(e) => onChange(goal, 'workingWeightMultiplier', e.target.value)}
                                                    error={Boolean(errors[goal].workingWeightMultiplier)}
                                                    hint={errors[goal].workingWeightMultiplier}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`${goal}-progressionIncrementKg`}>Progression Increment (kg)</Label>
                                                <Input
                                                    id={`${goal}-progressionIncrementKg`}
                                                    type="number"
                                                    step={0.1}
                                                    min="0"
                                                    value={form[goal].progressionIncrementKg}
                                                    onChange={(e) => onChange(goal, 'progressionIncrementKg', e.target.value)}
                                                    error={Boolean(errors[goal].progressionIncrementKg)}
                                                    hint={errors[goal].progressionIncrementKg}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`${goal}-minReps`}>Min Reps</Label>
                                                <Input
                                                    id={`${goal}-minReps`}
                                                    type="number"
                                                    min="1"
                                                    step={1}
                                                    value={form[goal].minReps}
                                                    onChange={(e) => onChange(goal, 'minReps', e.target.value)}
                                                    error={Boolean(errors[goal].minReps)}
                                                    hint={errors[goal].minReps}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
                                            <div>
                                                <Label htmlFor={`${goal}-maxReps`}>Max Reps</Label>
                                                <Input
                                                    id={`${goal}-maxReps`}
                                                    type="number"
                                                    min="1"
                                                    step={1}
                                                    value={form[goal].maxReps}
                                                    onChange={(e) => onChange(goal, 'maxReps', e.target.value)}
                                                    error={Boolean(errors[goal].maxReps)}
                                                    hint={errors[goal].maxReps}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`${goal}-minSets`}>Min Sets</Label>
                                                <Input
                                                    id={`${goal}-minSets`}
                                                    type="number"
                                                    min="1"
                                                    step={1}
                                                    value={form[goal].minSets}
                                                    onChange={(e) => onChange(goal, 'minSets', e.target.value)}
                                                    error={Boolean(errors[goal].minSets)}
                                                    hint={errors[goal].minSets}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`${goal}-maxSets`}>Max Sets</Label>
                                                <Input
                                                    id={`${goal}-maxSets`}
                                                    type="number"
                                                    min="1"
                                                    step={1}
                                                    value={form[goal].maxSets}
                                                    onChange={(e) => onChange(goal, 'maxSets', e.target.value)}
                                                    error={Boolean(errors[goal].maxSets)}
                                                    hint={errors[goal].maxSets}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 w-1/2">
                                            <Label htmlFor={`${goal}-focus`}>Coaching Focus</Label>
                                            <TextArea
                                                placeholder="Explain how the user should approach this goal."
                                                rows={3}
                                                value={form[goal].focus}
                                                onChange={(value) => onChange(goal, 'focus', value)}
                                                error={Boolean(errors[goal].focus)}
                                                hint={errors[goal].focus}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-1">
                                    <Button disabled={isUpdating}>
                                        {isUpdating ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}