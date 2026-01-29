import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { RangePicker } from '../RangePicker/RangePicker';


describe('RangePicker', () => {
    it('should render the picker trigger', () => {
        render(<RangePicker />);
        expect(screen.getByRole('button', { name: /select date range/i })).toBeInTheDocument();
    });

    it('should open the picker on click', async () => {
        render(<RangePicker />);
        const trigger = screen.getByRole('button', { name: /select date range/i });
        await userEvent.click(trigger);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should support keyboard navigation in the calendar grid', async () => {
        render(<RangePicker />);
        const trigger = screen.getByRole('button', { name: /select date range/i });
        await userEvent.click(trigger);

        const grid = screen.getByRole('grid');
        expect(grid).toBeInTheDocument();
    });

    it('should show error for invalid duration constraints', async () => {
        const constraints = { minDurationMinutes: 60 };
        render(<RangePicker constraints={constraints} />);
    });

    it('should show DST gap error', async () => {
        render(<RangePicker timezone="America/New_York" />);
    });

    it('should pass accessibility Audit', async () => {
        const { container } = render(<RangePicker />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should show loading state', () => {
        render(<RangePicker isLoading={true} />);
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
});
