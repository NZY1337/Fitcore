import { calculateOneRepMax, calculateWorkingWeight } from '../algorythm';

describe('calculateOneRepMax', () => {
    it('returns weight directly for 1 rep', () => {
        expect(calculateOneRepMax(100, 1)).toBe(100);
    });

    it('calculates 1RM correctly using Epley formula', () => {
        // 100 * (1 + 8/30) = 100 * 1.2667 = 126.67
        expect(calculateOneRepMax(100, 8)).toBe(126.67);
    });

    it('throws if weight is zero', () => {
        expect(() => calculateOneRepMax(0, 8)).toThrow();
    });

    it('throws if reps is zero', () => {
        expect(() => calculateOneRepMax(100, 0)).toThrow();
    });
});

describe('calculateWorkingWeight', () => {
    it('calculates 90% for strength', () => {
        expect(calculateWorkingWeight({ oneRepMax: 100, trainingGoal: 'strength' })).toBe(90);
    });

    it('calculates 75% for hypertrophy', () => {
        expect(calculateWorkingWeight({ oneRepMax: 100, trainingGoal: 'hypertrophy' })).toBe(75);
    });

    it('calculates 60% for endurance', () => {
        expect(calculateWorkingWeight({ oneRepMax: 100, trainingGoal: 'endurance' })).toBe(60);
    });

    it('throws if 1RM is zero', () => {
        expect(() => calculateWorkingWeight({ oneRepMax: 0, trainingGoal: 'strength' })).toThrow();
    });
});
