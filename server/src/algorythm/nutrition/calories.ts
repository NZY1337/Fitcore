import { ActivityGoal, CALORIE_TARGETS } from '../../utils/constants';

interface CalorieTargetInput {
    tdee: number;
    goal: ActivityGoal;
}

// TDEE: how many calories a person needs to maintain their current weight based on their activity level.
export function calculateCaloriesTarget({ tdee, goal }: CalorieTargetInput): number {
    if (tdee <= 0) {
        throw new Error('TDEE must be greater than zero.');
    }

    return parseFloat((tdee + CALORIE_TARGETS[goal]).toFixed(2));
}   