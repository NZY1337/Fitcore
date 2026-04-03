import { type BmiOutput, BMI_VALUES } from "../../utils/constants";

export function calculateBMI(weightKg: number, heightCm: number): BmiOutput {
    if (weightKg <= 0) {
        throw new Error('Weight must be greater than zero.');
    }

    if (heightCm <= 0) {
        throw new Error('Height must be greater than zero.');
    }

    let category: BmiOutput['category'] = 'normal_weight' // Define category variable with the correct type
    const heightM = heightCm / 100; // convert height from cm to m
    const bmi = weightKg / (heightM * heightM); // BMI formula: weight (kg) / height (m)^2

    if (bmi < BMI_VALUES.underweight) {
        category = 'underweight';
    } else if (bmi < BMI_VALUES.normal_weight) {
        category = 'normal_weight';
    } else if (bmi < BMI_VALUES.overweight) {
        category = 'overweight';
    } else {
        category = 'obesity';
    }

    return { bmi: parseFloat(bmi.toFixed(2)), category }; // round to 2 decimal places

}