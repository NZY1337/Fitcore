import { describe, it, expect, } from 'vitest';
import { render } from '@testing-library/react';
import { MacroBar } from './MacroBar';

describe('MacroBar', () => {
    it('should render the component', () => {
        const { getByText } = render(<MacroBar label="Proteine" value={29} total={30} color="bg-yellow-400" />);
        expect(getByText('Proteine')).toBeInTheDocument()
    })

    it('should display value and total', () => {
        const { getByText } = render(<MacroBar label="Proteine" value={29} total={30} color="bg-yellow-400" />);
        expect(getByText('29g')).toBeInTheDocument();
    });

    it('should clamp bar width to 100% when value exceeds total', () => {
        const { container } = render(<MacroBar label="Proteine" value={50} total={30} color="bg-yellow-400" />);
        const bar = container.querySelector('.bg-yellow-400');
        expect(bar).toHaveStyle({ width: '100%' });
    });

    it('should apply the color class to the progress bar', () => {
        const { container } = render(<MacroBar label="Proteine" value={15} total={30} color="bg-blue-400" />);
        expect(container.querySelector('.bg-blue-400')).toBeInTheDocument();
    });

})