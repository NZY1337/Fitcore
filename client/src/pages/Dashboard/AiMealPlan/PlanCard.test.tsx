import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlanCard } from './PlanCard';

import { VARIANT_BORDER, VARIANT_BADGE, VARIANT_BTN } from './PlanCard';

import type { PlanCardProps } from './PlanCard';

const defaultPlanCard: PlanCardProps = {
    variant: {
        name: 'Plan Echilibrat',
        description: 'Un plan alimentar echilibrat pentru intretinere.',
        daily_targets: { calories: 2000, protein: 150, carbs: 220, fat: 65 },
        meals: [
            {
                meal_type: 'breakfast',
                name: 'Omleta cu legume',
                instructions: 'Bate ouale si adauga legumele.',
                foods: [
                    { name: 'Oua', amount: '3 buc', calories: 210, protein: 18, carbs: 2, fat: 15 },
                    { name: 'Ardei', amount: '50g', calories: 16, protein: 1, carbs: 3, fat: 0 },
                ],
                totals: { calories: 226, protein: 19, carbs: 5, fat: 15 },
            },
        ],
    },
    index: 0,
    selected: false,
    isSelecting: false,
    onSelect: vi.fn(),
};

describe('PlanCard component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('should render the component', () => {
        const { container } = render(<PlanCard {...defaultPlanCard} />);
        expect(container).toBeInTheDocument()
    });

    it(`should have class: ${VARIANT_BORDER[0]}`, () => {
        const { container } = render(<PlanCard {...defaultPlanCard} selected={true} />)
        expect(container.firstChild).toHaveClass(VARIANT_BORDER[defaultPlanCard.index]);
    })

    it(`should have class: ${VARIANT_BADGE[0]}`, () => {
        render(<PlanCard {...defaultPlanCard} />)
        const p = screen.getByText('Varianta 1');
        expect(p).toHaveClass(VARIANT_BADGE[defaultPlanCard.index])
    })

    it(`should have class: ${VARIANT_BTN[0]} when selected`, () => {
        render(<PlanCard {...defaultPlanCard} selected={true} />)
        const btn = screen.getByRole('button', { name: /selectat/i })
        expect(btn).toHaveClass(VARIANT_BTN[defaultPlanCard.index])
    })

    it('should render the button disabled if isSelecting: true', () => {
        render(<PlanCard {...defaultPlanCard} isSelecting={true} />)
        const btn = screen.getByRole('button', { name: /alege acest plan/i })
        expect(btn).toBeDisabled()
    })

    it('should fire and event when onSelect is clicked', () => {
        render(<PlanCard {...defaultPlanCard} />)
        const btn = screen.getByRole('button', { name: /alege acest plan/i })
        fireEvent.click(btn);

        expect(defaultPlanCard.onSelect).toHaveBeenCalledTimes(1)
    })

    // this is a test case to explain why beforeEach/resetMocks is needed
    // without beforeEach button toHaveBeenCalledTimes(2)
    it('should check if button is called once', () => {
        render(<PlanCard {...defaultPlanCard} />)
        const btn = screen.getByRole('button', { name: /alege acest plan/i })
        fireEvent.click(btn);

        expect(defaultPlanCard.onSelect).toHaveBeenCalledTimes(1)
    })

    it('should render variant name and description', () => {
        render(<PlanCard {...defaultPlanCard} />)
        expect(screen.getByText('Plan Echilibrat')).toBeInTheDocument()
        expect(screen.getByText('Un plan alimentar echilibrat pentru intretinere.')).toBeInTheDocument()
    })

    it('should render calorie target', () => {
        render(<PlanCard {...defaultPlanCard} />)
        expect(screen.getByText('2000')).toBeInTheDocument()
        expect(screen.getByText('kcal/zi')).toBeInTheDocument()
    })

    it('should render a MealCard for each meal', () => {
        render(<PlanCard {...defaultPlanCard} />)
        expect(screen.getByText('Omleta cu legume')).toBeInTheDocument()
    })

    it('should show "Alege acest plan" when not selected', () => {
        render(<PlanCard {...defaultPlanCard} selected={false} />)
        expect(screen.getByRole('button', { name: /alege acest plan/i })).toBeInTheDocument()
    })

    it('should show "Selectat" when selected', () => {
        render(<PlanCard {...defaultPlanCard} selected={true} />)
        expect(screen.getByRole('button', { name: /selectat/i })).toBeInTheDocument()
    })

    it('should have default border class when not selected', () => {
        const { container } = render(<PlanCard {...defaultPlanCard} selected={false} />)
        expect(container.firstChild).toHaveClass('border-gray-200')
    })
});