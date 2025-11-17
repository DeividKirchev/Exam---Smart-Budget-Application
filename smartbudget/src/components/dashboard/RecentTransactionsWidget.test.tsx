/**
 * RecentTransactionsWidget Component Tests
 *
 * Tests for recent transactions widget component.
 * Target coverage: ≥85%
 *
 * @module components/dashboard/RecentTransactionsWidget.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';
import type { Transaction } from '../../models/Transaction';
import type { Period } from '../../models/Period';

// Mock useAppContext hook
const mockUseAppContext = vi.fn();
vi.mock('../../context/AppContext', () => ({
  useAppContext: () => mockUseAppContext(),
}));

// Mock getCategoryById
vi.mock('../../constants/categories', () => ({
  getCategoryById: (id: string) => {
    const categories: Record<string, { id: string; name: string }> = {
      salary: { id: 'salary', name: 'Salary' },
      freelance: { id: 'freelance', name: 'Freelance' },
      rent: { id: 'rent', name: 'Rent/Mortgage' },
      food: { id: 'food', name: 'Food/Groceries' },
      transport: { id: 'transport', name: 'Transport' },
    };
    return categories[id];
  },
}));

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecentTransactionsWidget', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      amount: 5000,
      date: '2025-11-20',
      category: 'salary',
      type: 'income',
      description: 'Monthly salary',
      createdAt: '2025-11-20T10:00:00Z',
      updatedAt: '2025-11-20T10:00:00Z',
    },
    {
      id: '2',
      amount: 1500,
      date: '2025-11-18',
      category: 'freelance',
      type: 'income',
      description: 'Freelance project payment',
      createdAt: '2025-11-18T10:00:00Z',
      updatedAt: '2025-11-18T10:00:00Z',
    },
    {
      id: '3',
      amount: 1200,
      date: '2025-11-15',
      category: 'rent',
      type: 'expense',
      description: 'Monthly rent payment',
      createdAt: '2025-11-15T10:00:00Z',
      updatedAt: '2025-11-15T10:00:00Z',
    },
    {
      id: '4',
      amount: 300,
      date: '2025-11-10',
      category: 'food',
      type: 'expense',
      description: 'Grocery shopping',
      createdAt: '2025-11-10T10:00:00Z',
      updatedAt: '2025-11-10T10:00:00Z',
    },
    {
      id: '5',
      amount: 50,
      date: '2025-11-05',
      category: 'transport',
      type: 'expense',
      description: 'Gas for car',
      createdAt: '2025-11-05T10:00:00Z',
      updatedAt: '2025-11-05T10:00:00Z',
    },
    {
      id: '6',
      amount: 200,
      date: '2025-11-01',
      category: 'food',
      type: 'expense',
      description: 'Restaurant dinner',
      createdAt: '2025-11-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
  ];

  const samplePeriod: Period = {
    type: 'this-month',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    label: 'This Month',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering with Data', () => {
    it('renders widget container with title', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    });

    it('renders "View All" link', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      const viewAllLink = screen.getByText('View All');
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink.closest('a')).toHaveAttribute('href', '/transactions');
    });

    it('displays default limit of 5 transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget limit={5} />);

      // Should display only 5 out of 6 transactions
      expect(screen.getByText('Monthly salary')).toBeInTheDocument();
      expect(screen.getByText('Freelance project payment')).toBeInTheDocument();
      expect(screen.getByText('Monthly rent payment')).toBeInTheDocument();
      expect(screen.getByText('Grocery shopping')).toBeInTheDocument();
      expect(screen.getByText('Gas for car')).toBeInTheDocument();
      expect(screen.queryByText('Restaurant dinner')).not.toBeInTheDocument(); // 6th item not shown
    });

    it('respects custom limit prop', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget limit={3} />);

      // Should display only 3 transactions
      expect(screen.getByText('Monthly salary')).toBeInTheDocument();
      expect(screen.getByText('Freelance project payment')).toBeInTheDocument();
      expect(screen.getByText('Monthly rent payment')).toBeInTheDocument();
      expect(screen.queryByText('Grocery shopping')).not.toBeInTheDocument();
    });

    it('displays transactions sorted by date descending (most recent first)', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      const transactions = screen.getAllByText(
        /Monthly salary|Freelance|Monthly rent|Grocery|Gas/
      );

      // First transaction should be most recent (Nov 20)
      expect(transactions[0]).toHaveTextContent('Monthly salary');
    });
  });

  describe('Transaction Display Format', () => {
    it('displays transaction description', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(screen.getByText('Monthly salary')).toBeInTheDocument();
      expect(screen.getByText('Monthly rent payment')).toBeInTheDocument();
    });

    it('displays category names', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget limit={5} />);

      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Rent/Mortgage')).toBeInTheDocument();
      expect(screen.getByText('Food/Groceries')).toBeInTheDocument();
    });

    it('displays formatted amounts for income transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      // Income should show with + prefix
      expect(screen.getByText(/\+\$5,000.00/)).toBeInTheDocument();
      expect(screen.getByText(/\+\$1,500.00/)).toBeInTheDocument();
    });

    it('displays formatted amounts for expense transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      // Expenses should show with - prefix
      expect(screen.getByText(/-\$1,200.00/)).toBeInTheDocument();
      expect(screen.getByText(/-\$300.00/)).toBeInTheDocument();
      expect(screen.getByText(/-\$50.00/)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(
        screen.getByText('No transactions in this period')
      ).toBeInTheDocument();
      expect(screen.queryByText('View All')).not.toBeInTheDocument();
    });

    it('displays empty state when no transactions in period', () => {
      const decemberPeriod: Period = {
        type: 'custom',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        label: 'December',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions, // All in November
        selectedPeriod: decemberPeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(
        screen.getByText('No transactions in this period')
      ).toBeInTheDocument();
    });
  });

  describe('Period Filtering', () => {
    it('filters transactions by selected period', () => {
      const shortPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-15',
        endDate: '2025-11-20',
        label: 'Mid Nov',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: shortPeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      // Should show only transactions in Nov 15-20 range
      expect(screen.getByText('Monthly salary')).toBeInTheDocument(); // Nov 20
      expect(screen.getByText('Freelance project payment')).toBeInTheDocument(); // Nov 18
      expect(screen.getByText('Monthly rent payment')).toBeInTheDocument(); // Nov 15

      // Should not show earlier transactions
      expect(screen.queryByText('Grocery shopping')).not.toBeInTheDocument(); // Nov 10
      expect(screen.queryByText('Gas for car')).not.toBeInTheDocument(); // Nov 5
    });

    it('uses provided period prop instead of selectedPeriod', () => {
      const customPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-10',
        label: 'Early Nov',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget period={customPeriod} />);

      // Should use custom period, not selectedPeriod
      expect(screen.getByText('Grocery shopping')).toBeInTheDocument(); // Nov 10
      expect(screen.getByText('Gas for car')).toBeInTheDocument(); // Nov 5
      expect(screen.queryByText('Monthly salary')).not.toBeInTheDocument(); // Nov 20, outside custom period
    });
  });

  describe('Edge Cases', () => {
    it('handles single transaction', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [sampleTransactions[0]],
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(screen.getByText('Monthly salary')).toBeInTheDocument();
    });

    it('handles transactions with unknown category', () => {
      const transactionsWithUnknownCategory: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-20',
          category: 'unknown-category',
          type: 'expense',
          description: 'Unknown category expense',
          createdAt: '2025-11-20T10:00:00Z',
          updatedAt: '2025-11-20T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions: transactionsWithUnknownCategory,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('handles fractional amounts correctly', () => {
      const fractionalTransaction: Transaction[] = [
        {
          id: '1',
          amount: 123.45,
          date: '2025-11-20',
          category: 'food',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-20T10:00:00Z',
          updatedAt: '2025-11-20T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions: fractionalTransaction,
        selectedPeriod: samplePeriod,
      });

      renderWithRouter(<RecentTransactionsWidget />);

      expect(screen.getByText(/-\$123.45/)).toBeInTheDocument();
    });
  });
});
