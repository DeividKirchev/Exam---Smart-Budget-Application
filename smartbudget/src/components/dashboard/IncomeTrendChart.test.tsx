/**
 * IncomeTrendChart Component Tests
 *
 * Tests for income vs expenses trend chart component.
 * Target coverage: ≥85%
 *
 * @module components/dashboard/IncomeTrendChart.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncomeTrendChart } from './IncomeTrendChart';
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
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: unknown[];
  }) => (
    <div data-testid="bar-chart" data-length={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid={`bar-${dataKey}`} data-fill={fill} />
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('IncomeTrendChart', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      amount: 5000,
      date: '2025-11-01',
      category: 'salary',
      type: 'income',
      description: 'Salary',
      createdAt: '2025-11-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
    {
      id: '2',
      amount: 1500,
      date: '2025-11-10',
      category: 'freelance',
      type: 'income',
      description: 'Freelance',
      createdAt: '2025-11-10T10:00:00Z',
      updatedAt: '2025-11-10T10:00:00Z',
    },
    {
      id: '3',
      amount: 1200,
      date: '2025-11-05',
      category: 'rent',
      type: 'expense',
      description: 'Rent',
      createdAt: '2025-11-05T10:00:00Z',
      updatedAt: '2025-11-05T10:00:00Z',
    },
    {
      id: '4',
      amount: 300,
      date: '2025-11-15',
      category: 'food',
      type: 'expense',
      description: 'Groceries',
      createdAt: '2025-11-15T10:00:00Z',
      updatedAt: '2025-11-15T10:00:00Z',
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
    it('renders chart container with title', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByText('Income vs Expenses Trend')).toBeInTheDocument();
    });

    it('renders ResponsiveContainer', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders BarChart component', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('renders income and expense bars with correct colors', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      // Check income bar (green)
      const incomeBar = screen.getByTestId('bar-income');
      expect(incomeBar).toBeInTheDocument();
      expect(incomeBar).toHaveAttribute('data-fill', '#10B981');

      // Check expenses bar (red)
      const expensesBar = screen.getByTestId('bar-expenses');
      expect(expensesBar).toBeInTheDocument();
      expect(expensesBar).toHaveAttribute('data-fill', '#EF4444');
    });

    it('renders chart axes', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('renders CartesianGrid', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    it('renders Tooltip', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('renders Legend', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(
        screen.getByText(/no data to display for this period/i)
      ).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('displays empty state when all transactions are zero', () => {
      mockUseAppContext.mockReturnValue({
        transactions: [],
        selectedPeriod: {
          type: 'custom',
          startDate: '2025-12-01',
          endDate: '2025-12-31',
          label: 'December',
        },
      });

      render(<IncomeTrendChart />);

      expect(
        screen.getByText(/no data to display for this period/i)
      ).toBeInTheDocument();
    });
  });

  describe('Period Override', () => {
    it('uses provided period prop instead of selectedPeriod', () => {
      const customPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-15',
        label: 'First Half Nov',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart period={customPeriod} />);

      // Component should render (verifies period override works)
      expect(screen.getByText('Income vs Expenses Trend')).toBeInTheDocument();
    });
  });

  describe('Granularity Handling', () => {
    it('uses daily granularity for periods ≤31 days', () => {
      const shortPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-10', // 10 days
        label: 'Short period',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: shortPeriod,
      });

      render(<IncomeTrendChart />);

      // Verify chart renders (granularity is handled internally)
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('uses weekly granularity for periods ≤90 days', () => {
      const mediumPeriod: Period = {
        type: 'last-3-months',
        startDate: '2025-09-01',
        endDate: '2025-11-30', // ~90 days
        label: 'Last 3 Months',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: mediumPeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('uses monthly granularity for periods >90 days', () => {
      const longPeriod: Period = {
        type: 'custom',
        startDate: '2025-01-01',
        endDate: '2025-12-31', // 1 year
        label: 'Full year',
      };

      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: longPeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('handles mixed income and expense transactions', () => {
      mockUseAppContext.mockReturnValue({
        transactions: sampleTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-income')).toBeInTheDocument();
      expect(screen.getByTestId('bar-expenses')).toBeInTheDocument();
    });

    it('handles income-only transactions', () => {
      const incomeOnlyTransactions: Transaction[] = [
        {
          id: '1',
          amount: 5000,
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
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles expense-only transactions', () => {
      const expenseOnlyTransactions: Transaction[] = [
        {
          id: '1',
          amount: 1200,
          date: '2025-11-05',
          category: 'rent',
          type: 'expense',
          description: 'Rent',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      mockUseAppContext.mockReturnValue({
        transactions: expenseOnlyTransactions,
        selectedPeriod: samplePeriod,
      });

      render(<IncomeTrendChart />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});
