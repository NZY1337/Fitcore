import { calculateCaloriesTarget } from '../algorythm';

describe('calculateCaloriesTarget', () => {
    it('returns TDEE minus 500 for cut', () => {
        expect(calculateCaloriesTarget({ tdee: 2800, goal: 'cut' })).toBe(2300);
    });

    it('returns TDEE unchanged for maintain', () => {
        expect(calculateCaloriesTarget({ tdee: 2800, goal: 'maintain' })).toBe(2800);
    });

    it('returns TDEE plus 500 for bulk', () => {
        expect(calculateCaloriesTarget({ tdee: 2800, goal: 'bulk' })).toBe(3300);
    });

    it('throws if TDEE is zero', () => {
        expect(() => calculateCaloriesTarget({ tdee: 0, goal: 'maintain' })).toThrow();
    });
});
