//////////////////////////////
// This module provides a function to calculate Basal Metabolic Rate (BMR) based on an individual's weight, height, age, and gender
// The BMR is calculated using the Mifflin-St Jeor Equation, which is widely used for estimating BMR.
//////////////////////////////

interface BMRInput {
    weight: number; // in kg
    height: number; // in cm
    age: number; // in years
    gender: 'male' | 'female';
}

export function calculateBMR({ weight, height, gender, age }: BMRInput): number {
    let bmr: number;

    if (weight <= 0 || height <= 0 || age <= 0) {
        throw new Error('Weight, height, and age must be greater than zero.');
    }

    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    return parseFloat(bmr.toFixed(2));
}
