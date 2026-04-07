export type WorkoutLogFormState = {
    exercise: string;
    sets: string;
    reps: string;
    weight_kg: string;
};

export type WorkoutLogFormErrors = Partial<Record<keyof WorkoutLogFormState, string>>;

const asInt = (v: string) => Number.parseInt(v, 10);
const asFloat = (v: string) => Number.parseFloat(v);

export function validateWorkoutLog(values: WorkoutLogFormState): WorkoutLogFormErrors {
    const nextErrors: WorkoutLogFormErrors = {};

    if (!values.exercise.trim()) nextErrors.exercise = 'Exercise name is required';

    const sets = asInt(values.sets);
    if (!values.sets || Number.isNaN(sets)) nextErrors.sets = 'Sets is required';
    else if (sets <= 0) nextErrors.sets = 'Sets must be greater than 0';

    const reps = asInt(values.reps);
    if (!values.reps || Number.isNaN(reps)) nextErrors.reps = 'Reps is required';
    else if (reps <= 0) nextErrors.reps = 'Reps must be greater than 0';

    const weight = asFloat(values.weight_kg);
    if (!values.weight_kg || Number.isNaN(weight)) nextErrors.weight_kg = 'Weight is required';
    else if (weight <= 0) nextErrors.weight_kg = 'Weight must be greater than 0';

    return nextErrors;
}
