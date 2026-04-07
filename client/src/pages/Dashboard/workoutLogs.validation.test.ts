import { describe, it, expect } from 'vitest';
import { validateWorkoutLog } from './workoutLogs.validation';

const validForm = {
    exercise: 'Bench Press',
    sets: '3',
    reps: '8',
    weight_kg: '80',
};

describe('validateWorkoutLog', () => {
    it('returns no errors for valid input', () => {
        expect(validateWorkoutLog(validForm)).toEqual({});
    });

    it('requires exercise name', () => {
        const errors = validateWorkoutLog({ ...validForm, exercise: '' });
        expect(errors.exercise).toBe('Exercise name is required');
    });

    it('requires exercise name to not be whitespace only', () => {
        const errors = validateWorkoutLog({ ...validForm, exercise: '   ' });
        expect(errors.exercise).toBe('Exercise name is required');
    });

    it('requires sets', () => {
        const errors = validateWorkoutLog({ ...validForm, sets: '' });
        expect(errors.sets).toBe('Sets is required');
    });

    it('rejects sets of 0', () => {
        const errors = validateWorkoutLog({ ...validForm, sets: '0' });
        expect(errors.sets).toBe('Sets must be greater than 0');
    });

    it('rejects negative sets', () => {
        const errors = validateWorkoutLog({ ...validForm, sets: '-1' });
        expect(errors.sets).toBe('Sets must be greater than 0');
    });

    it('requires reps', () => {
        const errors = validateWorkoutLog({ ...validForm, reps: '' });
        expect(errors.reps).toBe('Reps is required');
    });

    it('rejects reps of 0', () => {
        const errors = validateWorkoutLog({ ...validForm, reps: '0' });
        expect(errors.reps).toBe('Reps must be greater than 0');
    });

    it('requires weight', () => {
        const errors = validateWorkoutLog({ ...validForm, weight_kg: '' });
        expect(errors.weight_kg).toBe('Weight is required');
    });

    it('rejects weight of 0', () => {
        const errors = validateWorkoutLog({ ...validForm, weight_kg: '0' });
        expect(errors.weight_kg).toBe('Weight must be greater than 0');
    });

    it('rejects negative weight', () => {
        const errors = validateWorkoutLog({ ...validForm, weight_kg: '-5' });
        expect(errors.weight_kg).toBe('Weight must be greater than 0');
    });

    it('accepts decimal weight', () => {
        const errors = validateWorkoutLog({ ...validForm, weight_kg: '82.5' });
        expect(errors.weight_kg).toBeUndefined();
    });
});
