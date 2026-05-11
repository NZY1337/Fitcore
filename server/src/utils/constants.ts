export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
export type ActivityGoal = 'cut' | 'maintain' | 'bulk';
export type BmiWeightCategory = 'underweight' | 'normal_weight' | 'overweight' | 'obesity';
export type TrainingGoalInput = 'strength' | 'hypertrophy' | 'endurance';

export const TRAINING_GOALS: Record<TrainingGoalInput, number> = {
    strength: 0.9,
    hypertrophy: 0.75,
    endurance: 0.6
}

export type BmiOutput = {
    bmi: number;
    category: BmiWeightCategory;
}

export enum Plan {
    FREE = 'free',
    PRO = 'pro',
    PREMIUM = 'premium',
}

export const BMI_VALUES = {
    underweight: 18.5,
    normal_weight: 25,
    overweight: 30,
}

export const TDEE_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
};

export const CALORIE_TARGETS: Record<ActivityGoal, number> = {
    cut: -500, // A common recommendation is to create a deficit of 500 calories per day to lose about 0.5 kg (1 pound) per week.
    maintain: 0,
    bulk: 500, // A common recommendation is to create a surplus of 500 calories per day to gain about 0.5 kg (1 pound) per week.
};