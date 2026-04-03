export type HeartRateZone = { min: number; max: number };
export type HeartRateZonesOutput = Record<'recovery' | 'fatBurn' | 'aerobic' | 'anaerobic' | 'maxEffort', HeartRateZone>;

export function calculateHeartRateZones(age: number): HeartRateZonesOutput {
    if (age <= 0 || age >= 100) {
        throw new Error('Age must be between 1 and 100 years.');
    }

    const maxHeartRate = 220 - age;

    return {
        recovery: { min: Math.round(maxHeartRate * 0.5) + 1, max: Math.round(maxHeartRate * 0.6) }, // 50-60% of max HR
        fatBurn: { min: Math.round(maxHeartRate * 0.6) + 1, max: Math.round(maxHeartRate * 0.7) }, // 60-70% of max HR
        aerobic: { min: Math.round(maxHeartRate * 0.7) + 1, max: Math.round(maxHeartRate * 0.8) }, // 70-80% of max HR
        anaerobic: { min: Math.round(maxHeartRate * 0.8) + 1, max: Math.round(maxHeartRate * 0.9) }, // 80-90% of max HR
        maxEffort: { min: Math.round(maxHeartRate * 0.9) + 1, max: maxHeartRate } //  90-100% of max HR
    };
}