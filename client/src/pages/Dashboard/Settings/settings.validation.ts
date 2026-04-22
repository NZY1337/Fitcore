import type { SettingsDto, TrainingGoalKey, UpdateSettingsDto } from '../../../services/settings';

export type GoalSettingsFormState = {
    workingWeightMultiplier: string;
    minReps: string;
    maxReps: string;
    minSets: string;
    maxSets: string;
    progressionIncrementKg: string;
    focus: string;
};

export type SettingsFormState = Record<TrainingGoalKey, GoalSettingsFormState>;

export type GoalSettingsFormErrors = Partial<Record<keyof GoalSettingsFormState, string>>;
export type SettingsFormErrors = Record<TrainingGoalKey, GoalSettingsFormErrors>;

export const createEmptyErrors = (): SettingsFormErrors => ({
    strength: {},
    hypertrophy: {},
    endurance: {},
});

const toGoalFormState = (goal: SettingsDto[TrainingGoalKey]): GoalSettingsFormState => ({
    workingWeightMultiplier: String(goal.workingWeightMultiplier),
    minReps: String(goal.minReps),
    maxReps: String(goal.maxReps),
    minSets: String(goal.minSets),
    maxSets: String(goal.maxSets),
    progressionIncrementKg: String(goal.progressionIncrementKg),
    focus: goal.focus,
});

export const toFormState = (settings: SettingsDto): SettingsFormState => ({
    strength: toGoalFormState(settings.strength),
    hypertrophy: toGoalFormState(settings.hypertrophy),
    endurance: toGoalFormState(settings.endurance),
});

const parsePositiveNumber = (value: string) => Number.parseFloat(value);
const parsePositiveInt = (value: string) => Number.parseInt(value, 10);

export const validateSettings = (form: SettingsFormState): SettingsFormErrors => {
    const errors = createEmptyErrors();
    const goals: TrainingGoalKey[] = ['strength', 'hypertrophy', 'endurance'];

    for (const goal of goals) {
        const current = form[goal];
        const multiplier = parsePositiveNumber(current.workingWeightMultiplier);
        const minReps = parsePositiveInt(current.minReps);
        const maxReps = parsePositiveInt(current.maxReps);
        const minSets = parsePositiveInt(current.minSets);
        const maxSets = parsePositiveInt(current.maxSets);
        const increment = parsePositiveNumber(current.progressionIncrementKg);

        if (!Number.isFinite(multiplier) || multiplier <= 0) {
            errors[goal].workingWeightMultiplier = 'Enter a number greater than 0.';
        }

        if (!Number.isInteger(minReps) || minReps <= 0) {
            errors[goal].minReps = 'Enter a positive whole number.';
        }

        if (!Number.isInteger(maxReps) || maxReps <= 0) {
            errors[goal].maxReps = 'Enter a positive whole number.';
        }

        if (Number.isInteger(minReps) && Number.isInteger(maxReps) && minReps > maxReps) {
            errors[goal].maxReps = 'Max reps must be greater than or equal to min reps.';
        }

        if (!Number.isInteger(minSets) || minSets <= 0) {
            errors[goal].minSets = 'Enter a positive whole number.';
        }

        if (!Number.isInteger(maxSets) || maxSets <= 0) {
            errors[goal].maxSets = 'Enter a positive whole number.';
        }

        if (Number.isInteger(minSets) && Number.isInteger(maxSets) && minSets > maxSets) {
            errors[goal].maxSets = 'Max sets must be greater than or equal to min sets.';
        }

        if (!Number.isFinite(increment) || increment < 0) {
            errors[goal].progressionIncrementKg = 'Enter 0 or a positive number.';
        }

        if (!current.focus.trim()) {
            errors[goal].focus = 'Focus guidance is required.';
        }
    }

    return errors;
};

export const hasSettingsErrors = (errors: SettingsFormErrors): boolean => (
    Object.values(errors).some((goalErrors) => Object.keys(goalErrors).length > 0)
);

export const toSettingsPayload = (form: SettingsFormState): UpdateSettingsDto => ({
    strength: {
        workingWeightMultiplier: parsePositiveNumber(form.strength.workingWeightMultiplier),
        minReps: parsePositiveInt(form.strength.minReps),
        maxReps: parsePositiveInt(form.strength.maxReps),
        minSets: parsePositiveInt(form.strength.minSets),
        maxSets: parsePositiveInt(form.strength.maxSets),
        progressionIncrementKg: parsePositiveNumber(form.strength.progressionIncrementKg),
        focus: form.strength.focus.trim(),
    },
    hypertrophy: {
        workingWeightMultiplier: parsePositiveNumber(form.hypertrophy.workingWeightMultiplier),
        minReps: parsePositiveInt(form.hypertrophy.minReps),
        maxReps: parsePositiveInt(form.hypertrophy.maxReps),
        minSets: parsePositiveInt(form.hypertrophy.minSets),
        maxSets: parsePositiveInt(form.hypertrophy.maxSets),
        progressionIncrementKg: parsePositiveNumber(form.hypertrophy.progressionIncrementKg),
        focus: form.hypertrophy.focus.trim(),
    },
    endurance: {
        workingWeightMultiplier: parsePositiveNumber(form.endurance.workingWeightMultiplier),
        minReps: parsePositiveInt(form.endurance.minReps),
        maxReps: parsePositiveInt(form.endurance.maxReps),
        minSets: parsePositiveInt(form.endurance.minSets),
        maxSets: parsePositiveInt(form.endurance.maxSets),
        progressionIncrementKg: parsePositiveNumber(form.endurance.progressionIncrementKg),
        focus: form.endurance.focus.trim(),
    },
});