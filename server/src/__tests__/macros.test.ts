import { calculateMacros } from '../algorythm';

describe('calculateMacros', () => {
    it('returns correct protein grams (2g per kg)', () => {
        const result = calculateMacros(2500, 80);
        expect(result.protein).toBe(160); // 80 * 2
    });

    it('returns correct fat grams (27.5% of calories / 9)', () => {
        const result = calculateMacros(2500, 80);
        expect(result.fat).toBeCloseTo(76.39, 1); // 2500 * 0.275 / 9
    });

    it('returns correct carbs (remaining calories / 4)', () => {
        // 2500 - (160*4) - (2500*0.275) = 2500 - 640 - 687.5 = 1172.5 / 4 = 293.13
        const result = calculateMacros(2500, 80);
        expect(result.carbs).toBeCloseTo(293.13, 1);
    });

    it('throws if calorie target is zero', () => {
        expect(() => calculateMacros(0, 80)).toThrow();
    });

    it('throws if weight is zero', () => {
        expect(() => calculateMacros(2500, 0)).toThrow();
    });

    it('throws if calorie target is too low for given weight', () => {
        expect(() => calculateMacros(500, 150)).toThrow('Calorie target is too low for the given weight.');
    });
});
