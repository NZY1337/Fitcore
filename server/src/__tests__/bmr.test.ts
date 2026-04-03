import { calculateBMR } from '../algorythm';

describe('calculateBMR', () => {
    it('calculates BMR correctly for male', () => {
        // 10*80 + 6.25*180 - 5*25 + 5 = 800 + 1125 - 125 + 5 = 1805
        expect(calculateBMR({ weight: 80, height: 180, age: 25, gender: 'male' })).toBe(1805);
    });

    it('calculates BMR correctly for female', () => {
        // 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
        expect(calculateBMR({ weight: 60, height: 165, age: 30, gender: 'female' })).toBe(1320.25);
    });

    it('throws if weight is zero', () => {
        expect(() => calculateBMR({ weight: 0, height: 180, age: 25, gender: 'male' })).toThrow();
    });

    it('throws if height is negative', () => {
        expect(() => calculateBMR({ weight: 80, height: -1, age: 25, gender: 'male' })).toThrow();
    });

    it('throws if age is zero', () => {
        expect(() => calculateBMR({ weight: 80, height: 180, age: 0, gender: 'male' })).toThrow();
    });
});
