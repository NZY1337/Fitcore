import { calculateVolume } from '../algorythm';

describe('calculateVolume', () => {
    it('calculates volume correctly', () => {
        expect(calculateVolume({ sets: 4, reps: 8, weightKg: 100 })).toBe(3200);
    });

    it('calculates volume with decimal weight', () => {
        expect(calculateVolume({ sets: 3, reps: 10, weightKg: 102.5 })).toBe(3075);
    });

    it('throws if sets is zero', () => {
        expect(() => calculateVolume({ sets: 0, reps: 8, weightKg: 100 })).toThrow();
    });

    it('throws if reps is zero', () => {
        expect(() => calculateVolume({ sets: 4, reps: 0, weightKg: 100 })).toThrow();
    });

    it('throws if weight is zero', () => {
        expect(() => calculateVolume({ sets: 4, reps: 8, weightKg: 0 })).toThrow();
    });
});
