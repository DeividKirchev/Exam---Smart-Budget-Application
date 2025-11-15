/**
 * PeriodSelector Component Tests
 *
 * Tests for period selector component.
 * Target coverage: ≥85%
 *
 * @module components/dashboard/PeriodSelector.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PeriodSelector } from './PeriodSelector';
import type { Period } from '../../models/Period';

// Mock usePeriod hook
const mockUsePeriod = vi.fn();
vi.mock('../../hooks/usePeriod', () => ({
  usePeriod: () => mockUsePeriod(),
}));

// Mock period helpers
const mockFormatCustomLabel = vi.fn();
vi.mock('../../utils/periodHelpers', () => ({
  formatCustomLabel: (start: string, end: string) =>
    mockFormatCustomLabel(start, end),
}));

// Mock validators
const mockValidateDateRange = vi.fn();
vi.mock('../../utils/validators', () => ({
  validateDateRange: (start: string, end: string) =>
    mockValidateDateRange(start, end),
}));

describe('PeriodSelector', () => {
  const mockSetPeriod = vi.fn();

  const mockPeriodOptions: Period[] = [
    {
      type: 'this-month',
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      label: 'This Month',
    },
    {
      type: 'last-month',
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      label: 'Last Month',
    },
    {
      type: 'last-3-months',
      startDate: '2025-08-01',
      endDate: '2025-11-15',
      label: 'Last 3 Months',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePeriod.mockReturnValue({
      selectedPeriod: mockPeriodOptions[0],
      setPeriod: mockSetPeriod,
      periodOptions: mockPeriodOptions,
      isCustomPeriod: false,
    });
  });

  describe('Rendering', () => {
    it('renders dropdown with period options', () => {
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox', {
        name: /select time period/i,
      });
      expect(dropdown).toBeInTheDocument();
    });

    it('displays all preset period options in dropdown', () => {
      render(<PeriodSelector />);

      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
      expect(screen.getByText('Last 3 Months')).toBeInTheDocument();
    });

    it('displays Custom Range option', () => {
      render(<PeriodSelector />);

      expect(screen.getByText(/custom range/i)).toBeInTheDocument();
    });

    it('displays currently selected period label', () => {
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('this-month');
    });
  });

  describe('ARIA Accessibility', () => {
    it('has aria-label on dropdown', () => {
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveAttribute('aria-label', 'Select time period');
    });

    it('has screen reader label for select', () => {
      render(<PeriodSelector />);

      const label = screen.getByText('Select time period');
      expect(label).toHaveClass('sr-only');
    });

    it('has aria-live region for selected period', () => {
      render(<PeriodSelector />);

      const liveRegion = screen.getByText(/currently selected: this month/i);
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Preset Period Selection', () => {
    it('calls setPeriod with correct period when This Month selected', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'this-month');

      expect(mockSetPeriod).toHaveBeenCalledWith(mockPeriodOptions[0]);
    });

    it('calls setPeriod with correct period when Last Month selected', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'last-month');

      expect(mockSetPeriod).toHaveBeenCalledWith(mockPeriodOptions[1]);
    });

    it('calls setPeriod with correct period when Last 3 Months selected', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'last-3-months');

      expect(mockSetPeriod).toHaveBeenCalledWith(mockPeriodOptions[2]);
    });
  });

  describe('Custom Range Picker', () => {
    it('opens custom range picker when Custom Range selected', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      expect(screen.getByText('Select Custom Date Range')).toBeInTheDocument();
    });

    it('displays start and end date inputs in custom picker', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    });

    it('displays Apply and Cancel buttons in custom picker', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      expect(
        screen.getByRole('button', { name: /apply/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('closes custom picker when Cancel clicked', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(
        screen.queryByText('Select Custom Date Range')
      ).not.toBeInTheDocument();
    });

    it('closes custom picker when X button clicked', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      const closeButton = screen.getByRole('button', {
        name: /close custom range picker/i,
      });
      await user.click(closeButton);

      expect(
        screen.queryByText('Select Custom Date Range')
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom Range Validation', () => {
    it('applies valid custom range and calls setPeriod', async () => {
      const user = userEvent.setup();
      mockValidateDateRange.mockReturnValue({ valid: true });
      mockFormatCustomLabel.mockReturnValue('Nov 1 - Nov 15, 2025');

      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      // Enter dates
      const startInput = screen.getByLabelText(/start date/i);
      const endInput = screen.getByLabelText(/end date/i);
      await user.type(startInput, '2025-11-01');
      await user.type(endInput, '2025-11-15');

      // Apply
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      expect(mockSetPeriod).toHaveBeenCalledWith({
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-15',
        label: 'Nov 1 - Nov 15, 2025',
      });
    });

    it('shows validation error for invalid date range', async () => {
      const user = userEvent.setup();
      mockValidateDateRange.mockReturnValue({
        valid: false,
        error: 'End date must be after or equal to start date',
      });

      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      // Enter invalid dates (end before start)
      const startInput = screen.getByLabelText(/start date/i);
      const endInput = screen.getByLabelText(/end date/i);
      await user.type(startInput, '2025-11-15');
      await user.type(endInput, '2025-11-01');

      // Try to apply
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      expect(
        screen.getByText('End date must be after or equal to start date')
      ).toBeInTheDocument();
      expect(mockSetPeriod).not.toHaveBeenCalled();
    });

    it('shows validation error for future date', async () => {
      const user = userEvent.setup();
      mockValidateDateRange.mockReturnValue({
        valid: false,
        error: 'End date cannot be in the future',
      });

      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      // Enter future dates
      const startInput = screen.getByLabelText(/start date/i);
      const endInput = screen.getByLabelText(/end date/i);
      await user.type(startInput, '2025-11-01');
      await user.type(endInput, '2026-12-31');

      // Try to apply
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      expect(
        screen.getByText('End date cannot be in the future')
      ).toBeInTheDocument();
      expect(mockSetPeriod).not.toHaveBeenCalled();
    });

    it('disables Apply button when dates are not filled', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      const applyButton = screen.getByRole('button', { name: /apply/i });
      expect(applyButton).toBeDisabled();
    });

    it('enables Apply button when both dates are filled', async () => {
      const user = userEvent.setup();
      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      // Enter dates
      const startInput = screen.getByLabelText(/start date/i);
      const endInput = screen.getByLabelText(/end date/i);
      await user.type(startInput, '2025-11-01');
      await user.type(endInput, '2025-11-15');

      const applyButton = screen.getByRole('button', { name: /apply/i });
      expect(applyButton).not.toBeDisabled();
    });

    it('clears validation error when user changes dates', async () => {
      const user = userEvent.setup();
      mockValidateDateRange
        .mockReturnValueOnce({
          valid: false,
          error: 'End date must be after or equal to start date',
        })
        .mockReturnValueOnce({ valid: true });

      render(<PeriodSelector />);

      // Open custom picker
      const dropdown = screen.getByRole('combobox');
      await user.selectOptions(dropdown, 'custom');

      // Enter invalid dates
      const startInput = screen.getByLabelText(/start date/i);
      const endInput = screen.getByLabelText(/end date/i);
      await user.type(startInput, '2025-11-15');
      await user.type(endInput, '2025-11-01');

      // Try to apply (triggers error)
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      expect(
        screen.getByText('End date must be after or equal to start date')
      ).toBeInTheDocument();

      // Change dates (should clear error)
      await user.clear(endInput);
      await user.type(endInput, '2025-11-20');

      expect(
        screen.queryByText('End date must be after or equal to start date')
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom CSS Classes', () => {
    it('applies custom className prop', () => {
      const { container } = render(
        <PeriodSelector className="my-custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-custom-class');
    });
  });
});
