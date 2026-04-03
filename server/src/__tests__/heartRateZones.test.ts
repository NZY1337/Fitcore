import { calculateHeartRateZones } from '../algorythm';

describe('calculateHeartRateZones', () => {
    it('calculates correct HRmax for age 25', () => {
        // HRmax = 220 - 25 = 195
        const zones = calculateHeartRateZones(25);
        expect(zones.maxEffort.max).toBe(195);
    });

    it('recovery zone starts at 50% of HRmax', () => {
        const zones = calculateHeartRateZones(25); // HRmax = 195
        expect(zones.recovery.min).toBe(Math.round(195 * 0.5) + 1);
    });

    it('zones are contiguous (each zone starts after previous ends)', () => {
        const zones = calculateHeartRateZones(30);
        expect(zones.fatBurn.min).toBe(zones.recovery.max + 1);
        expect(zones.aerobic.min).toBe(zones.fatBurn.max + 1);
        expect(zones.anaerobic.min).toBe(zones.aerobic.max + 1);
        expect(zones.maxEffort.min).toBe(zones.anaerobic.max + 1);
    });

    it('returns all 5 zones', () => {
        const zones = calculateHeartRateZones(25);
        expect(zones).toHaveProperty('recovery');
        expect(zones).toHaveProperty('fatBurn');
        expect(zones).toHaveProperty('aerobic');
        expect(zones).toHaveProperty('anaerobic');
        expect(zones).toHaveProperty('maxEffort');
    });

    it('throws if age is zero', () => {
        expect(() => calculateHeartRateZones(0)).toThrow();
    });

    it('throws if age is 100 or more', () => {
        expect(() => calculateHeartRateZones(100)).toThrow();
    });
});
