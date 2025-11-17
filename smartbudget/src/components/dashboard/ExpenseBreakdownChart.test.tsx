/**
 * ExpenseBreakdownChart Component Tests
 *
 * Tests for expense breakdown pie chart component.
 * Target coverage: ≥85%
 *
 * @module components/dashboard/ExpenseBreakdownChart.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import type { Transaction } from '../../models/Transaction';
import type { Period } from '../../models/Period';

// Mock useAppContext hook
const mockUseAppContext = vi.fn();
vi.mock('../../context/AppContext', () => ({
  useAppContext: () => mockUseAppContext(),
}));

// Mock Recharts components to simplify testing
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data }: { data: unknown[] }) => (
    <div data-testid="pie" data-length={data.length} />
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('ExpenseBreakdownChart', () => {
  const sampleExpenseTransactions: Transaction[] = [
    {
      id: '1',
      amount: 150,
      date: '2025-11-10',
      category: 'groceries',
      type: 'expense',
      description: 'Groceries',
      createdAt: '2025-11-10T10:00:00Z',
      updatedAt: '2025-11-10T10:00:00Z',
    },
    {
      id: '2',
      amount: 200,
      date: '2025-11-05',
      category: 'rent',
      type: 'expense',
      description: 'Rent',
      createdAt: '2025-11-05T10:00:00Z',
      updatedAt: '2025-11-05T10:00:00Z',
    },
    {
      id: '3',
      amount: 50,
      date: '2025-11-15',
      category: 'transport',
      type: 'expense',
      description: 'Transport',
      createdAt: '2025-11-15T10:00:00Z',
      updatedAt: '2025-11-15T10:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders chart container with title', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('renders ResponsiveContainer', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders PieChart component', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('renders Pie component with data', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      const pie = screen.getByTestId('pie');
      expect(pie).toBeInTheDocument();
      // Should have 3 categories (groceries, rent, transport)
      expect(pie.getAttribute('data-length')).toBe('3');
    });

    it('renders Tooltip component', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('renders Legend component', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
      });

      render(<ExpenseBreakdownChart />);

      expect(
        screen.getByText(/no expenses to display for this period/i)
      ).toBeInTheDocument();
    });

    it('displays empty state when no expense transactions', () => {
      const incomeOnlyTransactions: Transaction[] = [
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
      ];

      mockUseAppContext.mockReturnValue({
        transactions: incomeOnlyTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(
        screen.getByText(/no expenses to display for this period/i)
      ).toBeInTheDocument();
    });

    it('does not render chart when empty', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('responsive-container')
      ).not.toBeInTheDocument();
    });

    it('displays PieChart icon in empty state', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
      });

      const { container } = render(<ExpenseBreakdownChart />);

      // Check for lucide-react PieChart icon (has specific SVG attributes)
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Data Filtering', () => {
    it('displays only expense categories with amounts > 0', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 150,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
        {
          id: '2',
          amount: 1000,
          date: '2025-11-01',
          category: 'salary',
          type: 'income',
          description: 'Salary (should not appear)',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions,
      });

      render(<ExpenseBreakdownChart />);

      const pie = screen.getByTestId('pie');
      // Should only have 1 category (groceries, not salary)
      expect(pie.getAttribute('data-length')).toBe('1');
    });

    it('filters by period when provided', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 150,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Nov Groceries',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
        {
          id: '2',
          amount: 200,
          date: '2025-12-05',
          category: 'groceries',
          type: 'expense',
          description: 'Dec Groceries (outside period)',
          createdAt: '2025-12-05T10:00:00Z',
          updatedAt: '2025-12-05T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      mockUseAppContext.mockReturnValue({
        transactions,
      });

      render(<ExpenseBreakdownChart period={period} />);

      const pie = screen.getByTestId('pie');
      // Should only show Nov expenses (1 category)
      expect(pie.getAttribute('data-length')).toBe('1');
    });

    it('aggregates multiple transactions in same category', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries 1',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
        {
          id: '2',
          amount: 50,
          date: '2025-11-15',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries 2',
          createdAt: '2025-11-15T10:00:00Z',
          updatedAt: '2025-11-15T10:00:00Z',
        },
        {
          id: '3',
          amount: 200,
          date: '2025-11-05',
          category: 'rent',
          type: 'expense',
          description: 'Rent',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions,
      });

      render(<ExpenseBreakdownChart />);

      const pie = screen.getByTestId('pie');
      // Should have 2 categories (groceries aggregated, rent)
      expect(pie.getAttribute('data-length')).toBe('2');
    });
  });

  describe('Custom CSS Classes', () => {
    it('applies custom className prop', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      const { container } = render(
        <ExpenseBreakdownChart className="my-custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-custom-class');
    });

    it('applies default classes', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      const { container } = render(<ExpenseBreakdownChart />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-white');
      expect(wrapper).toHaveClass('border');
      expect(wrapper).toHaveClass('rounded-lg');
    });
  });

  describe('Period Prop', () => {
    it('works without period prop', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart />);

      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });

    it('works with period prop', () => {
      const period: Period = {
        type: 'this-month',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'This Month',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleExpenseTransactions,
      });

      render(<ExpenseBreakdownChart period={period} />);

      expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('re-renders when transactions change', () => {
      const initialTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions: initialTransactions,
      });

      const { rerender } = render(<ExpenseBreakdownChart />);

      let pie = screen.getByTestId('pie');
      expect(pie.getAttribute('data-length')).toBe('1');

      // Update transactions
      const updatedTransactions: Transaction[] = [
        ...initialTransactions,
        {
          id: '2',
          amount: 200,
          date: '2025-11-15',
          category: 'rent',
          type: 'expense',
          description: 'Rent',
          createdAt: '2025-11-15T10:00:00Z',
          updatedAt: '2025-11-15T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions: updatedTransactions,
      });

      rerender(<ExpenseBreakdownChart />);

      pie = screen.getByTestId('pie');
      expect(pie.getAttribute('data-length')).toBe('2');
    });

    it('re-renders when period changes', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Nov Groceries',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
        {
          id: '2',
          amount: 200,
          date: '2025-12-05',
          category: 'groceries',
          type: 'expense',
          description: 'Dec Groceries',
          createdAt: '2025-12-05T10:00:00Z',
          updatedAt: '2025-12-05T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions,
      });

      const novemberPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const { rerender } = render(
        <ExpenseBreakdownChart period={novemberPeriod} />
      );

      let pie = screen.getByTestId('pie');
      expect(pie.getAttribute('data-length')).toBe('1'); // Only Nov

      // Change to December period
      const decemberPeriod: Period = {
        type: 'custom',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        label: 'December',
      };

      rerender(<ExpenseBreakdownChart period={decemberPeriod} />);

      pie = screen.getByTestId('pie');
      expect(pie.getAttribute('data-length')).toBe('1'); // Only Dec
    });
  });
});
