import { calculateBodyFat } from '../algorythm';

describe('calculateBodyFat', () => {
    it('calculates body fat for male', () => {
        const result = calculateBodyFat({ waistCm: 85, neckCm: 38, heightCm: 180, gender: 'male' });
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(50);
    });

    it('calculates body fat for female', () => {
        const result = calculateBodyFat({ waistCm: 75, neckCm: 33, heightCm: 165, hipCm: 95, gender: 'female' });
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(50);
    });

    it('throws if hip is missing for female', () => {
        expect(() => calculateBodyFat({ waistCm: 75, neckCm: 33, heightCm: 165, gender: 'female' })).toThrow();
    });

    it('throws if waist <= neck', () => {
        expect(() => calculateBodyFat({ waistCm: 38, neckCm: 38, heightCm: 180, gender: 'male' })).toThrow();
    });

    it('throws if measurements are zero', () => {
        expect(() => calculateBodyFat({ waistCm: 0, neckCm: 38, heightCm: 180, gender: 'male' })).toThrow();
    });
});
