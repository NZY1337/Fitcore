//////////////////////////
// This module provides a function to calculate Total Daily Energy Expenditure (TDEE) 
// based on Basal Metabolic Rate (BMR) and activity level. 
// The TDEE is calculated by multiplying the BMR with a specific multiplier corresponding to the individual's activity level.
//////////////////////////

import { ActivityLevel, TDEE_MULTIPLIERS } from '../../utils/constants';

interface TDEEInput {
    bmr: number;
    activityLevel: ActivityLevel;
}

export function calculateTDEE({ bmr, activityLevel }: TDEEInput): number {
    if (bmr <= 0) {
        throw new Error('BMR must be greater than zero.');
    }

    return parseFloat((bmr * TDEE_MULTIPLIERS[activityLevel]).toFixed(2));
}