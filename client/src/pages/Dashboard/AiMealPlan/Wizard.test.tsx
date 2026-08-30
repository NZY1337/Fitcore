import { describe, it, expect, vi, } from 'vitest';
import { render, screen, fireEvent, } from '@testing-library/react';
import { Wizard } from './Wizard';
import { COMMON_ALLERGIES } from './Wizard';

import type { WizardProps } from './Wizard';

const defaultProps: WizardProps = {
    onGenerate: vi.fn(),
    isGenerating: true
}

describe('Wizard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('should render the component', () => {
        const { container } = render(<Wizard {...defaultProps} />);
        expect(container).toBeInTheDocument();
    });

    it('should display the progress bar container & the stpes(3)', () => {
        const { getByTestId } = render(<Wizard {...defaultProps} />);
        const wizardContainer = getByTestId('wizard-progress-bar');
        expect(wizardContainer).toBeInTheDocument();
        expect(wizardContainer.children).toHaveLength(3)
    });


    // BAD EXAMPLE: storing a DOM element in a variable is a stale reference.
    // After React re-renders (e.g. step changes), the variable still points to the OLD element
    // that was removed from the DOM. Always query with screen.getByTestId() at the moment you need it.
    it.skip('WRONG TEST :: should display the next step on click', () => {
        const { getByTestId } = render(<Wizard {...defaultProps} />);
        const continueButton = getByTestId('wizard-continue-button'); // stale after first click

        expect(continueButton).toBeInTheDocument()

        // step 2
        fireEvent.click(continueButton);
        const backButton = getByTestId('wizard-back-button');
        expect(backButton).toBeInTheDocument();

        // step 3
        fireEvent.click(continueButton);
        const generateButton = getByTestId('wizard-generate-button');
        expect(backButton).toBeInTheDocument();
        expect(generateButton).toBeInTheDocument();
        expect(continueButton).toBeInTheDocument();
    });

    it('should display the next step on click', () => {
        render(<Wizard {...defaultProps} />);

        // step 1
        expect(screen.getByTestId('wizard-continue-button')).toBeInTheDocument();

        // step 2
        fireEvent.click(screen.getByTestId('wizard-continue-button'));
        expect(screen.getByTestId('wizard-back-button')).toBeInTheDocument();
        expect(screen.getByTestId('wizard-continue-button')).toBeInTheDocument();

        // step 3
        fireEvent.click(screen.getByTestId('wizard-continue-button'));
        expect(screen.getByTestId('wizard-generate-button')).toBeInTheDocument();
        expect(screen.getByTestId('wizard-back-button')).toBeInTheDocument();
        expect(screen.queryByTestId('wizard-continue-button')).not.toBeInTheDocument();
    });

    it('should toggle common alergies on step#1', () => {
        render(<Wizard {...defaultProps} />);
        const toggleAlergyBtn = screen.getByRole('button', { name: new RegExp(COMMON_ALLERGIES[0], 'i') });
        expect(toggleAlergyBtn).toBeInTheDocument();

        expect(toggleAlergyBtn).toHaveAttribute('aria-pressed', 'false');
        fireEvent.click(toggleAlergyBtn);
        expect(toggleAlergyBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should avoid specific elements on step#1', () => {
        render(<Wizard {...defaultProps} />);
        const avoidInput = screen.getByRole('textbox', { name: /avoid-input/i });
        const avoidButton = screen.getByRole('button', { name: /adauga/i });

        expect(avoidInput).toBeInTheDocument();
        expect(avoidButton).toBeInTheDocument();

        fireEvent.change(avoidInput, { target: { value: 'broccoli' } });
        fireEvent.click(avoidButton);
        expect(avoidButton).toHaveValue('');

        fireEvent.change(avoidInput, { target: { value: 'oregano' } });
        fireEvent.click(avoidButton);
        expect(avoidButton).toHaveValue('');

        expect(screen.getByText('broccoli')).toBeInTheDocument();
        expect(screen.getByText('oregano')).toBeInTheDocument();
    })

    describe('Step 2 — diet type', () => {
        function renderStep2() {
            render(<Wizard {...defaultProps} />);
            fireEvent.click(screen.getByTestId('wizard-continue-button'));
        }

        it('renders all 4 diet type options', () => {
            renderStep2();

            expect(screen.getByText('Omnivor')).toBeInTheDocument();
            expect(screen.getByText('Vegetarian')).toBeInTheDocument();
            expect(screen.getByText('Vegan')).toBeInTheDocument();
            expect(screen.getByText('Pescatarian')).toBeInTheDocument();
        });

        it('selects omnivore by default', () => {
            renderStep2();

            expect(screen.getByRole('button', { name: /omnivor/i })).toHaveClass('border-brand-500');
            expect(screen.getByRole('button', { name: /vegan/i })).not.toHaveClass('border-brand-500');
        });

        it('changes the active diet type on click', () => {
            renderStep2();

            fireEvent.click(screen.getByRole('button', { name: /vegan/i }));

            expect(screen.getByRole('button', { name: /vegan/i })).toHaveClass('border-brand-500');
            expect(screen.getByRole('button', { name: /omnivor/i })).not.toHaveClass('border-brand-500');
        });

        it('only one diet type is selected at a time', () => {
            renderStep2();

            fireEvent.click(screen.getByRole('button', { name: /pescatarian/i }));

            const selected = screen
                .getAllByRole('button')
                .filter(btn => btn.classList.contains('border-brand-500') && btn !== screen.getByTestId('wizard-continue-button'));

            expect(selected).toHaveLength(1);
            expect(selected[0]).toHaveAccessibleName(/pescatarian/i);
        });
    });

    describe('Step 3 — meals per day', () => {
        function renderStep3() {
            render(<Wizard {...defaultProps} />);
            fireEvent.click(screen.getByTestId('wizard-continue-button'));
            fireEvent.click(screen.getByTestId('wizard-continue-button'));
        }

        it('renders all meal count options', () => {
            renderStep3();

            [3, 4, 5, 6].forEach(n => {
                expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument();
            });
        });

        it('selects 4 meals by default', () => {
            renderStep3();

            expect(screen.getByRole('button', { name: '4' })).toHaveClass('border-brand-500');
            expect(screen.getByRole('button', { name: '3' })).not.toHaveClass('border-brand-500');
        });

        it('changes the selected meal count on click', () => {
            renderStep3();

            fireEvent.click(screen.getByRole('button', { name: '5' }));

            expect(screen.getByRole('button', { name: '5' })).toHaveClass('border-brand-500');
            expect(screen.getByRole('button', { name: '4' })).not.toHaveClass('border-brand-500');
        });

        it('updates the summary text when meal count changes', () => {
            renderStep3();

            expect(screen.getByText(/distribuite in 4 mese/i)).toBeInTheDocument();

            fireEvent.click(screen.getByRole('button', { name: '6' }));

            expect(screen.getByText(/distribuite in 6 mese/i)).toBeInTheDocument();
        });

        it('calls onGenerate with the selected meals per day', () => {
            const onGenerate = vi.fn();
            render(<Wizard onGenerate={onGenerate} isGenerating={false} />);
            fireEvent.click(screen.getByTestId('wizard-continue-button'));
            fireEvent.click(screen.getByTestId('wizard-continue-button'));

            fireEvent.click(screen.getByRole('button', { name: '6' }));
            fireEvent.click(screen.getByTestId('wizard-generate-button'));

            expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({ meals_per_day: 6 }));
        });
    });

    it('should remove avoided element onClick on step#1', () => {
        render(<Wizard {...defaultProps} />);
        const avoidInput = screen.getByRole('textbox', { name: /avoid-input/i });
        const avoidButton = screen.getByRole('button', { name: /adauga/i });

        expect(avoidInput).toBeInTheDocument();
        expect(avoidButton).toBeInTheDocument();

        fireEvent.change(avoidInput, { target: { value: 'broccoli' } });
        fireEvent.click(avoidButton);

        fireEvent.change(avoidInput, { target: { value: 'carrot' } });
        fireEvent.click(avoidButton);

        const availableBroccoliButton = screen.getByRole('button', { name: /broccoli/i });

        fireEvent.click(availableBroccoliButton);
        expect(availableBroccoliButton).not.toBeInTheDocument();

        const availabCarrotButton = screen.getByRole('button', { name: /carrot/i });
        expect(availabCarrotButton).toBeInTheDocument();

        fireEvent.click(availabCarrotButton)
        expect(availabCarrotButton).not.toBeInTheDocument();

        expect(avoidButton).toHaveValue('');
    });
})