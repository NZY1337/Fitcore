import { describe, it, expect, } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealCard } from './MealCard';
import type { Meal } from './MealCard';

const defaultMeal: Meal = {
    meal_type: 'breakfast',
    name: 'Bacon and Eggs',
    instructions: 'Cook bacon in a pan, fry eggs alongside.',
    foods: [
        { name: 'Bacon', amount: '100g', calories: 541, protein: 37, carbs: 1, fat: 42 },
    ],
    totals: { calories: 684, protein: 50, carbs: 2, fat: 52 },
};

describe('MealCard', () => {
    it('should render the component', () => {
        const { container } = render(<MealCard meal={defaultMeal} />);
        expect(container).toBeInTheDocument()
    });

    it('should expand meal details on click', () => {
        render(<MealCard meal={defaultMeal} />)

        // details are hidden initially
        expect(screen.queryByText('Cook bacon in a pan, fry eggs alongside.')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));

        // details are shown
        expect(screen.queryByText('Cook bacon in a pan, fry eggs alongside.')).toBeInTheDocument();

        // now this behaves like a toggle
        fireEvent.click(screen.getByRole('button'));

        expect(screen.queryByText('Cook bacon in a pan, fry eggs alongside.')).not.toBeInTheDocument();
    })

    it('should display proteins, carbs and fat details on click', () => {
        render(<MealCard meal={defaultMeal} />)

        // details are hidden initially
        fireEvent.click(screen.getByRole('button'));

        // details are shown
        expect(screen.queryByText('P: 50g')).toBeInTheDocument();
        expect(screen.queryByText('C: 2g')).toBeInTheDocument();
        expect(screen.queryByText('F: 52g')).toBeInTheDocument();
    })

    it('should display meal food name, amount, and calories', () => {
        render(<MealCard meal={defaultMeal} />)

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Bacon')).toBeInTheDocument();
        expect(screen.getByText('100g')).toBeInTheDocument();
        expect(screen.getByText('541 kcal')).toBeInTheDocument();
    })
});
