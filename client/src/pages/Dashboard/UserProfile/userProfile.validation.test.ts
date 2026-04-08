import { describe, it, expect } from 'vitest';
import { validateUserProfile } from './userProfile.validation';

const TODAY = '2026-04-07';

const validForm = {
    gender: 'male' as const,
    weight_kg: '70',
    height_cm: '175',
    waist_cm: '80',
    neck_cm: '40',
    hip_cm: '90',
    date_of_birth: '1990-01-01',
    activity_level: 'sedentary' as const,
    activity_goal: 'maintain' as const,
    training_goal: 'strength' as const,
};

describe('validateUserProfile', () => {
    it('returns no errors for valid input', () => {
        expect(validateUserProfile(validForm, TODAY)).toEqual({});
    });

    // gender
    it('requires gender', () => {
        const errors = validateUserProfile({ ...validForm, gender: '' }, TODAY);
        expect(errors.gender).toBe('Gender is required');
    });

    // weight
    it('requires weight', () => {
        const errors = validateUserProfile({ ...validForm, weight_kg: '' }, TODAY);
        expect(errors.weight_kg).toBe('Weight is required');
    });

    it('rejects weight of 0', () => {
        const errors = validateUserProfile({ ...validForm, weight_kg: '0' }, TODAY);
        expect(errors.weight_kg).toBe('Weight must be between 0.1 and 500 kg');
    });

    it('rejects weight above 500', () => {
        const errors = validateUserProfile({ ...validForm, weight_kg: '501' }, TODAY);
        expect(errors.weight_kg).toBe('Weight must be between 0.1 and 500 kg');
    });

    // height
    it('requires height', () => {
        const errors = validateUserProfile({ ...validForm, height_cm: '' }, TODAY);
        expect(errors.height_cm).toBe('Height is required');
    });

    it('rejects height above 300', () => {
        const errors = validateUserProfile({ ...validForm, height_cm: '301' }, TODAY);
        expect(errors.height_cm).toBe('Height must be between 0.1 and 300 cm');
    });

    // waist / neck cross-field
    it('requires waist', () => {
        const errors = validateUserProfile({ ...validForm, waist_cm: '' }, TODAY);
        expect(errors.waist_cm).toBe('Waist is required');
    });

    it('rejects waist <= neck', () => {
        const errors = validateUserProfile({ ...validForm, waist_cm: '40', neck_cm: '40' }, TODAY);
        expect(errors.waist_cm).toBe('Waist must be greater than neck measurement.');
    });

    it('rejects waist < neck', () => {
        const errors = validateUserProfile({ ...validForm, waist_cm: '35', neck_cm: '40' }, TODAY);
        expect(errors.waist_cm).toBe('Waist must be greater than neck measurement.');
    });

    // hip
    it('requires hip', () => {
        const errors = validateUserProfile({ ...validForm, hip_cm: '' }, TODAY);
        expect(errors.hip_cm).toBe('Hip is required');
    });

    // date of birth
    it('requires date of birth', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: '' }, TODAY);
        expect(errors.date_of_birth).toBe('Date of birth is required');
    });

    it('rejects wrong format', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: '07/04/1990' }, TODAY);
        expect(errors.date_of_birth).toBe('Use format YYYY-MM-DD');
    });

    it('rejects year below 1900', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: '1899-01-01' }, TODAY);
        expect(errors.date_of_birth).toMatch(/Year must be between 1900/);
    });

    it('rejects invalid calendar date', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: '1990-02-31' }, TODAY);
        expect(errors.date_of_birth).toBe('Date of birth is invalid');
    });

    it('rejects date equal to today', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: TODAY }, TODAY);
        expect(errors.date_of_birth).toBe('Year must be between 1900 and 2026');
    });

    it('rejects future date', () => {
        const errors = validateUserProfile({ ...validForm, date_of_birth: '2030-01-01' }, TODAY);
        expect(errors.date_of_birth).toBe('Year must be between 1900 and 2026');
    });

    // dropdowns
    it('requires activity level', () => {
        const errors = validateUserProfile({ ...validForm, activity_level: '' }, TODAY);
        expect(errors.activity_level).toBe('Activity level is required');
    });

    it('requires activity goal', () => {
        const errors = validateUserProfile({ ...validForm, activity_goal: '' }, TODAY);
        expect(errors.activity_goal).toBe('Activity goal is required');
    });

    it('requires training goal', () => {
        const errors = validateUserProfile({ ...validForm, training_goal: '' }, TODAY);
        expect(errors.training_goal).toBe('Training goal is required');
    });
});
