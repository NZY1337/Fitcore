import type { TrainingGuidanceSettings } from './settings.types';

export const DEFAULT_TRAINING_GUIDANCE_SETTINGS: TrainingGuidanceSettings = {
    strength: {
        workingWeightMultiplier: 0.9,
        minReps: 3,
        maxReps: 5,
        minSets: 3,
        maxSets: 5,
        progressionIncrementKg: 5,
        focus: 'Use longer rest periods and prioritize clean, heavy sets.',
    },
    hypertrophy: {
        workingWeightMultiplier: 0.75,
        minReps: 8,
        maxReps: 12,
        minSets: 3,
        maxSets: 4,
        progressionIncrementKg: 2.5,
        focus: 'Control the tempo and keep the target muscle under tension.',
    },
    endurance: {
        workingWeightMultiplier: 0.6,
        minReps: 12,
        maxReps: 15,
        minSets: 2,
        maxSets: 4,
        progressionIncrementKg: 2.5,
        focus: 'Keep rest short and aim for repeatable effort across all sets.',
    },
};