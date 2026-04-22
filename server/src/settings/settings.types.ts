import { type TrainingGoalInput } from '../utils/constants';

export type TrainingGoalSettings = {
    workingWeightMultiplier: number;
    minReps: number;
    maxReps: number;
    minSets: number;
    maxSets: number;
    progressionIncrementKg: number;
    focus: string;
};

export type TrainingGuidanceSettings = Record<TrainingGoalInput, TrainingGoalSettings>;