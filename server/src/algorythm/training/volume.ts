// This function calculates the training volume based on the number of sets, reps, and weight lifted in kilograms.
interface VolumeInput {
    sets: number;
    reps: number;
    weightKg: number;
}

export function calculateVolume({ sets, reps, weightKg }: VolumeInput): number {
    if (sets <= 0 || reps <= 0 || weightKg <= 0) {
        throw new Error('Sets, reps, and weight must be greater than zero.');
    }

    return sets * reps * weightKg
}