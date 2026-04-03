import { calculateBMI } from '../algorythm';

describe('calculateBMI', () => {
    it('calculates BMI correctly', () => {
        // 80 / (1.80 * 1.80) = 24.69
        expect(calculateBMI(80, 180).bmi).toBe(24.69);
    });

    it('returns underweight category', () => {
        expect(calculateBMI(50, 180).category).toBe('underweight'); // BMI ~15.4
    });

    it('returns normal_weight category', () => {
        expect(calculateBMI(70, 175).category).toBe('normal_weight'); // BMI ~22.9
    });

    it('returns overweight category', () => {
        expect(calculateBMI(90, 175).category).toBe('overweight'); // BMI ~29.4
    });

    it('returns obesity category', () => {
        expect(calculateBMI(110, 175).category).toBe('obesity'); // BMI ~35.9
    });

    it('throws if weight is zero', () => {
        expect(() => calculateBMI(0, 180)).toThrow();
    });

    it('throws if height is zero', () => {
        expect(() => calculateBMI(80, 0)).toThrow();
    });
});
