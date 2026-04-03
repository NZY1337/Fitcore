// This function calculates the macronutrient distribution based on a given calorie 
// target and weight in kilograms.

export function calculateMacros(calorieTarget: number, weightKg: number): { protein: number; fat: number; carbs: number } {
    if (calorieTarget <= 0) {
        throw new Error('Calorie target must be greater than zero.');
    }

    if (weightKg <= 0) {
        throw new Error('Weight must be greater than zero.');
    }

    const proteinGrams = weightKg * 2; // 2g per kg corp
    const proteinCalories = proteinGrams * 4; // 1g proteină = 4 kcal

    const fatCalories = calorieTarget * 0.275; // 27.5% din calorieTarget
    const fatGrams = fatCalories / 9; // 1g grăsime = 9 kcal

    const carbCalories = calorieTarget - proteinCalories - fatCalories;

    if (carbCalories < 0) {
        throw new Error('Calorie target is too low for the given weight.');
    }

    const carbGrams = carbCalories / 4; // 1g carb = 4 kcal

    return {
        protein: parseFloat(proteinGrams.toFixed(2)),
        fat: parseFloat(fatGrams.toFixed(2)),
        carbs: parseFloat(carbGrams.toFixed(2)),
    };
}
