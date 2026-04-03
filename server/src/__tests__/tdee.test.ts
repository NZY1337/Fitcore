import { calculateTDEE } from '../algorythm';

describe('calculateTDEE', () => {
    it('calculates TDEE for sedentary', () => {
        expect(calculateTDEE({ bmr: 1800, activityLevel: 'sedentary' })).toBe(2160);
    });

    it('calculates TDEE for moderately_active', () => {
        expect(calculateTDEE({ bmr: 1800, activityLevel: 'moderately_active' })).toBe(2790);
    });

    it('calculates TDEE for very_active', () => {
        expect(calculateTDEE({ bmr: 1800, activityLevel: 'very_active' })).toBe(3105);
    });

    it('throws if BMR is zero', () => {
        expect(() => calculateTDEE({ bmr: 0, activityLevel: 'sedentary' })).toThrow();
    });

    it('throws if BMR is negative', () => {
        expect(() => calculateTDEE({ bmr: -100, activityLevel: 'sedentary' })).toThrow();
    });
});
