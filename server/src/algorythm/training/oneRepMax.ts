import { type TrainingGoalInput, TRAINING_GOALS } from "../../utils/constants";
/*
    Ridici 10kg pentru 10 repetări
    10 * (1 + 10/30) = 10 * 1.333 = 13.33kg
    Înseamnă: dacă te-ai strădui la maximum, ai putea ridica 13.33kg o singură dată

    Din 1RM poți programa antrenamentul:

    60% din 1RM → antrenament de rezistență/încălzire = 13.33 * 0.6 = 8kg
    75% din 1RM → hipertrofie (masă musculară) = 13.33 * 0.75 = 10kg
    90% din 1RM → forță = 13.33 * 0.9 = 12kg
*/

/**
 * Estimates the one-rep max (1RM) using the Epley formula.
 * @param weightKg - The weight lifted in kg (e.g. 100 for 100kg on the bar)
 * @param reps - The number of repetitions performed at that weight (e.g. 8)
 * @returns Estimated maximum weight (kg) that can be lifted for a single repetition
 */
export function calculateOneRepMax(weightKg: number, reps: number): number {
    if (weightKg <= 0) {
        throw new Error('Weight must be greater than zero.');
    }

    if (reps <= 0) {
        throw new Error('Reps must be greater than zero.');
    }

    if (reps === 1) return parseFloat(weightKg.toFixed(2)); // if only 1 rep was performed, the weight lifted is already the 1RM

    const oneRepMax = weightKg * (1 + (reps / 30));
    return parseFloat(oneRepMax.toFixed(2));
}

// with how many kg you can train based on your 1RM and the training goal (strength, hypertrophy, endurance)
export function calculateWorkingWeight({ oneRepMax, trainingGoal }: { oneRepMax: number; trainingGoal: TrainingGoalInput }): number {
    if (oneRepMax <= 0) {
        throw new Error('One-rep max must be greater than zero.');
    }

    const workingWeight = oneRepMax * TRAINING_GOALS[trainingGoal];
    return parseFloat(workingWeight.toFixed(2));
}
