/**
 * SummaryCards Component Tests
 *
 * Tests for SummaryCards component covering:
 * - Rendering three cards with correct labels
 * - Currency formatting
 * - Net balance conditional styling
 * - Period filtering
 * - Real-time updates
 * - Edge cases
 *
 * Target coverage: ≥85%
 *
 * @module components/dashboard/SummaryCards.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from './SummaryCards';
import type { Transaction } from '../../models/Transaction';
import type { Period } from '../../models/Period';

// Mock the AppContext
const mockUseAppContext = vi.fn();
vi.mock('../../context/AppContext', () => ({
  useAppContext: () => mockUseAppContext(),
}));

describe('SummaryCards', () => {
  // Sample test transactions
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      amount: 5000,
      date: '2025-11-01',
      category: 'salary',
      type: 'income',
      description: 'Monthly salary',
      createdAt: '2025-11-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
    {
      id: '2',
      amount: 1500,
      date: '2025-11-05',
      category: 'freelance',
      type: 'income',
      description: 'Freelance project',
      createdAt: '2025-11-05T14:00:00Z',
      updatedAt: '2025-11-05T14:00:00Z',
    },
    {
      id: '3',
      amount: 1200,
      date: '2025-11-10',
      category: 'rent',
      type: 'expense',
      description: 'Monthly rent',
      createdAt: '2025-11-10T09:00:00Z',
      updatedAt: '2025-11-10T09:00:00Z',
    },
    {
      id: '4',
      amount: 300,
      date: '2025-11-15',
      category: 'groceries',
      type: 'expense',
      description: 'Groceries',
      createdAt: '2025-11-15T16:00:00Z',
      updatedAt: '2025-11-15T16:00:00Z',
    },
    {
      id: '5',
      amount: 200,
      date: '2025-10-25',
      category: 'utilities',
      type: 'expense',
      description: 'Electricity bill (Oct)',
      createdAt: '2025-10-25T11:00:00Z',
      updatedAt: '2025-10-25T11:00:00Z',
    },
  ];

  beforeEach(() => {
    // Reset mock before each test
    mockUseAppContext.mockReset();
  });

  describe('Rendering', () => {
    it('renders three cards with correct labels', () => {
      mockUseAppContext.mockReturnValue({ transactions: sampleTransactions });

      render(<SummaryCards />);

      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Balance')).toBeInTheDocument();
    });

    it('displays correct amounts for sample transactions', () => {
      mockUseAppContext.mockReturnValue({ transactions: sampleTransactions });

      render(<SummaryCards />);

      // Total Income: 5000 + 1500 = 6500
      expect(screen.getByText('$6,500.00')).toBeInTheDocument();
      // Total Expenses: 1200 + 300 + 200 = 1700
      expect(screen.getByText('$1,700.00')).toBeInTheDocument();
      // Net Balance: 6500 - 1700 = 4800
      expect(screen.getByText('$4,800.00')).toBeInTheDocument();
    });

    it('formats amounts as USD currency', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1234.56,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Test',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Should format with dollar sign, comma, and 2 decimals
      expect(screen.getAllByText('$1,234.56').length).toBeGreaterThan(0);
    });
  });

  describe('Net Balance Color', () => {
    it('displays green color when net balance is positive', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 300,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Expense',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Net balance should be positive (1000 - 300 = 700)
      const netBalanceElement = screen.getByText('$700.00');
      expect(netBalanceElement).toHaveClass('text-green-600');
    });

    it('displays red color when net balance is negative', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 300,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 1000,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Expense',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Net balance should be negative (300 - 1000 = -700)
      const netBalanceElement = screen.getByText('-$700.00');
      expect(netBalanceElement).toHaveClass('text-red-600');
    });

    it('displays gray color when net balance is zero', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 500,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 500,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Expense',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Net balance should be zero (500 - 500 = 0)
      const netBalanceElement = screen.getByText('$0.00');
      expect(netBalanceElement).toHaveClass('text-gray-600');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transactions array', () => {
      mockUseAppContext.mockReturnValue({ transactions: [] });

      render(<SummaryCards />);

      // All cards should show $0.00
      const zeroAmounts = screen.getAllByText('$0.00');
      expect(zeroAmounts).toHaveLength(3); // Income, Expenses, Balance
    });

    it('handles all income (no expenses)', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Salary',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 500,
          date: '2025-11-05',
          category: 'freelance',
          type: 'income',
          description: 'Freelance',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Total Income and Net Balance should both be $1,500.00
      const incomeAmounts = screen.getAllByText('$1,500.00');
      expect(incomeAmounts.length).toBe(2); // Income card and Balance card
      // Total Expenses should be $0.00
      expect(
        screen.getByText('Total Expenses').parentElement?.textContent
      ).toContain('$0.00');
    });

    it('handles all expenses (no income)', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 500,
          date: '2025-11-01',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 300,
          date: '2025-11-05',
          category: 'utilities',
          type: 'expense',
          description: 'Bills',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      expect(screen.getByText('$800.00')).toBeInTheDocument(); // Total Expenses
      expect(screen.getByText('-$800.00')).toBeInTheDocument(); // Negative balance
    });

    it('handles large amounts correctly', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1234567.89,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Large income',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];
      mockUseAppContext.mockReturnValue({ transactions });

      render(<SummaryCards />);

      // Should format with commas - appears in both Income and Balance cards
      const largeAmounts = screen.getAllByText('$1,234,567.89');
      expect(largeAmounts.length).toBeGreaterThan(0);
    });
  });

  describe('Period Filtering', () => {
    it('filters transactions by period when period prop provided', () => {
      mockUseAppContext.mockReturnValue({ transactions: sampleTransactions });

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-15',
        label: 'Nov 1-15',
      };

      render(<SummaryCards period={period} />);

      // Should only include transactions within Nov 1-15
      // Income: 5000 + 1500 = 6500
      expect(screen.getByText('$6,500.00')).toBeInTheDocument();
      // Expenses: 1200 + 300 = 1500 (excludes Oct 25 transaction)
      expect(screen.getByText('$1,500.00')).toBeInTheDocument();
      // Net Balance: 6500 - 1500 = 5000
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });

    it('calculates across all transactions when no period provided', () => {
      mockUseAppContext.mockReturnValue({ transactions: sampleTransactions });

      render(<SummaryCards />);

      // Should include all transactions including Oct 25
      // Total Expenses: 1200 + 300 + 200 = 1700
      expect(screen.getByText('$1,700.00')).toBeInTheDocument();
    });
  });

  describe('Updates', () => {
    it('updates when transactions change', () => {
      const initialTransactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Initial',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({ transactions: initialTransactions });

      const { rerender } = render(<SummaryCards />);

      // Initial amount appears in both Income and Balance cards
      expect(screen.getAllByText('$1,000.00').length).toBeGreaterThan(0);

      // Update transactions
      const updatedTransactions: Transaction[] = [
        ...initialTransactions,
        {
          id: '2',
          amount: 500,
          date: '2025-11-05',
          category: 'freelance',
          type: 'income',
          description: 'New income',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({ transactions: updatedTransactions });

      rerender(<SummaryCards />);

      // Should show updated total in both Income and Balance cards
      expect(screen.getAllByText('$1,500.00').length).toBeGreaterThan(0);
    });
  });
});
