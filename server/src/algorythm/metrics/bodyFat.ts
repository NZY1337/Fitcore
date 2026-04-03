interface BodyFatInput {
    waistCm: number;
    neckCm: number;
    heightCm: number;
    gender: 'male' | 'female';
    hipCm?: number
}

export function calculateBodyFat({ waistCm, neckCm, heightCm, hipCm, gender }: BodyFatInput): number {
    if (waistCm <= 0 || neckCm <= 0 || heightCm <= 0) {
        throw new Error('Waist, neck, and height measurements must be greater than zero.');
    }

    if (gender === 'female' && (!hipCm || hipCm <= 0)) {
        throw new Error('Hip measurement is required for female body fat calculation.');
    }

    // log10 can throw error if input is 0 or negative
    if (waistCm <= neckCm) {
        throw new Error('Waist must be greater than neck measurement.');
    }

    const bodyFat = gender === 'male'
        ? 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm! - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;

    return bodyFat > 0 ? parseFloat(bodyFat.toFixed(2)) : 0; // round to 2 decimal places and ensure non-negative
}