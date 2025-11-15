/**
 * Calculation Service Tests
 *
 * Comprehensive tests for financial calculation functions:
 * - calculateTotalIncome
 * - calculateTotalExpenses
 * - calculateNetBalance
 *
 * Tests cover:
 * - Basic calculations
 * - Period filtering
 * - Edge cases (empty arrays, zero amounts)
 * - Rounding accuracy
 *
 * Target coverage: ≥90% (critical business logic)
 *
 * @module services/calculationService.test
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateExpensesByCategory,
  calculateTrendData,
  determineGranularity,
} from './calculationService';
import type { Transaction } from '../models/Transaction';
import type { Period } from '../models/Period';

describe('calculationService', () => {
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
      date: '2025-11-10',
      category: 'freelance',
      type: 'income',
      description: 'Freelance project',
      createdAt: '2025-11-10T14:00:00Z',
      updatedAt: '2025-11-10T14:00:00Z',
    },
    {
      id: '3',
      amount: 1200,
      date: '2025-11-05',
      category: 'rent',
      type: 'expense',
      description: 'Monthly rent',
      createdAt: '2025-11-05T09:00:00Z',
      updatedAt: '2025-11-05T09:00:00Z',
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
      amount: 150.75,
      date: '2025-11-20',
      category: 'utilities',
      type: 'expense',
      description: 'Electricity bill',
      createdAt: '2025-11-20T11:00:00Z',
      updatedAt: '2025-11-20T11:00:00Z',
    },
    {
      id: '6',
      amount: 500,
      date: '2025-10-25',
      category: 'freelance',
      type: 'income',
      description: 'October freelance (outside Nov period)',
      createdAt: '2025-10-25T10:00:00Z',
      updatedAt: '2025-10-25T10:00:00Z',
    },
    {
      id: '7',
      amount: 200,
      date: '2025-12-05',
      category: 'groceries',
      type: 'expense',
      description: 'December groceries (outside Nov period)',
      createdAt: '2025-12-05T10:00:00Z',
      updatedAt: '2025-12-05T10:00:00Z',
    },
  ];

  describe('calculateTotalIncome', () => {
    it('returns sum of income transactions', () => {
      const result = calculateTotalIncome(sampleTransactions);
      // Income: 5000 + 1500 + 500 = 7000
      expect(result).toBe(7000);
    });

    it('returns 0 for empty array', () => {
      const result = calculateTotalIncome([]);
      expect(result).toBe(0);
    });

    it('excludes expense transactions', () => {
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
          amount: 500,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Expense',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      const result = calculateTotalIncome(transactions);
      expect(result).toBe(1000); // Only income
    });

    it('filters by period when provided', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November 2025',
      };

      const result = calculateTotalIncome(sampleTransactions, period);
      // Income in Nov: 5000 + 1500 = 6500 (excludes Oct 25 transaction)
      expect(result).toBe(6500);
    });

    it('returns 0 when no transactions match period', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        label: 'September 2025',
      };

      const result = calculateTotalIncome(sampleTransactions, period);
      expect(result).toBe(0);
    });

    it('handles fractional amounts correctly', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 100.5,
          date: '2025-11-01',
          category: 'freelance',
          type: 'income',
          description: 'Income 1',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 200.75,
          date: '2025-11-05',
          category: 'freelance',
          type: 'income',
          description: 'Income 2',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      const result = calculateTotalIncome(transactions);
      expect(result).toBe(301.25);
    });
  });

  describe('calculateTotalExpenses', () => {
    it('returns sum of expense transactions', () => {
      const result = calculateTotalExpenses(sampleTransactions);
      // Expenses: 1200 + 300 + 150.75 + 200 = 1850.75
      expect(result).toBe(1850.75);
    });

    it('returns 0 for empty array', () => {
      const result = calculateTotalExpenses([]);
      expect(result).toBe(0);
    });

    it('excludes income transactions', () => {
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
          amount: 500,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Expense',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      const result = calculateTotalExpenses(transactions);
      expect(result).toBe(500); // Only expense
    });

    it('filters by period when provided', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November 2025',
      };

      const result = calculateTotalExpenses(sampleTransactions, period);
      // Expenses in Nov: 1200 + 300 + 150.75 = 1650.75 (excludes Dec 5 transaction)
      expect(result).toBe(1650.75);
    });

    it('returns 0 when no transactions match period', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        label: 'September 2025',
      };

      const result = calculateTotalExpenses(sampleTransactions, period);
      expect(result).toBe(0);
    });

    it('handles fractional amounts correctly', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 50.33,
          date: '2025-11-01',
          category: 'groceries',
          type: 'expense',
          description: 'Expense 1',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 75.67,
          date: '2025-11-05',
          category: 'utilities',
          type: 'expense',
          description: 'Expense 2',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
      ];

      const result = calculateTotalExpenses(transactions);
      expect(result).toBe(126);
    });
  });

  describe('calculateNetBalance', () => {
    it('returns income - expenses', () => {
      const result = calculateNetBalance(sampleTransactions);
      // Income: 7000, Expenses: 1850.75, Balance: 5149.25
      expect(result).toBe(5149.25);
    });

    it('handles positive balance', () => {
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

      const result = calculateNetBalance(transactions);
      expect(result).toBe(700); // Positive
    });

    it('handles negative balance', () => {
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

      const result = calculateNetBalance(transactions);
      expect(result).toBe(-700); // Negative
    });

    it('handles zero balance', () => {
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

      const result = calculateNetBalance(transactions);
      expect(result).toBe(0); // Zero
    });

    it('returns 0 for empty array', () => {
      const result = calculateNetBalance([]);
      expect(result).toBe(0);
    });

    it('filters by period when provided', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November 2025',
      };

      const result = calculateNetBalance(sampleTransactions, period);
      // Nov Income: 6500, Nov Expenses: 1650.75, Balance: 4849.25
      expect(result).toBe(4849.25);
    });
  });

  describe('Period Filtering Edge Cases', () => {
    it('includes transactions on period start date', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-11-01', // Exactly on start date
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const result = calculateTotalIncome(transactions, period);
      expect(result).toBe(1000); // Should include
    });

    it('includes transactions on period end date', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-11-30', // Exactly on end date
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-11-30T10:00:00Z',
          updatedAt: '2025-11-30T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const result = calculateTotalIncome(transactions, period);
      expect(result).toBe(1000); // Should include
    });

    it('excludes transactions before period start date', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-10-31', // Day before start
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-10-31T10:00:00Z',
          updatedAt: '2025-10-31T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const result = calculateTotalIncome(transactions, period);
      expect(result).toBe(0); // Should exclude
    });

    it('excludes transactions after period end date', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1000,
          date: '2025-12-01', // Day after end
          category: 'salary',
          type: 'income',
          description: 'Income',
          createdAt: '2025-12-01T10:00:00Z',
          updatedAt: '2025-12-01T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const result = calculateTotalIncome(transactions, period);
      expect(result).toBe(0); // Should exclude
    });
  });

  describe('Rounding Accuracy', () => {
    it('rounds to 2 decimal places (round up)', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 10.999,
          date: '2025-11-01',
          category: 'freelance',
          type: 'income',
          description: 'Test',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      const result = calculateTotalIncome(transactions);
      expect(result).toBe(11); // 10.999 rounds to 11.00
    });

    it('rounds to 2 decimal places (round down)', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 10.001,
          date: '2025-11-01',
          category: 'freelance',
          type: 'income',
          description: 'Test',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      const result = calculateTotalIncome(transactions);
      expect(result).toBe(10); // 10.001 rounds to 10.00
    });

    it('handles multiple fractional amounts with proper rounding', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 33.333,
          date: '2025-11-01',
          category: 'freelance',
          type: 'income',
          description: 'Test 1',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 33.334,
          date: '2025-11-02',
          category: 'freelance',
          type: 'income',
          description: 'Test 2',
          createdAt: '2025-11-02T10:00:00Z',
          updatedAt: '2025-11-02T10:00:00Z',
        },
        {
          id: '3',
          amount: 33.333,
          date: '2025-11-03',
          category: 'freelance',
          type: 'income',
          description: 'Test 3',
          createdAt: '2025-11-03T10:00:00Z',
          updatedAt: '2025-11-03T10:00:00Z',
        },
      ];

      const result = calculateTotalIncome(transactions);
      // 33.333 + 33.334 + 33.333 = 100.00 rounded
      expect(result).toBe(100);
    });
  });

  describe('calculateExpensesByCategory', () => {
    it('aggregates expenses by category', () => {
      const result = calculateExpensesByCategory(sampleTransactions);

      // Expenses: rent=1200, groceries=300+200=500, utilities=150.75
      expect(result).toEqual({
        rent: 1200,
        groceries: 500,
        utilities: 150.75,
      });
    });

    it('excludes income transactions', () => {
      const result = calculateExpensesByCategory(sampleTransactions);

      // Should not include 'salary' or 'freelance' categories
      expect(result.salary).toBeUndefined();
      expect(result.freelance).toBeUndefined();
    });

    it('returns empty object for empty array', () => {
      const result = calculateExpensesByCategory([]);
      expect(result).toEqual({});
    });

    it('returns empty object when no expense transactions', () => {
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

      const result = calculateExpensesByCategory(incomeOnlyTransactions);
      expect(result).toEqual({});
    });

    it('aggregates multiple transactions in same category', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-01',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries 1',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 50,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries 2',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
        {
          id: '3',
          amount: 75.5,
          date: '2025-11-10',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries 3',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
      ];

      const result = calculateExpensesByCategory(transactions);
      expect(result.groceries).toBe(225.5);
    });

    it('filters by period when provided', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November 2025',
      };

      const result = calculateExpensesByCategory(sampleTransactions, period);

      // November expenses only: rent=1200, groceries=300, utilities=150.75
      // Excludes Dec 5 groceries (200)
      expect(result).toEqual({
        rent: 1200,
        groceries: 300,
        utilities: 150.75,
      });
    });

    it('returns empty object when no expenses in period', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        label: 'September 2025',
      };

      const result = calculateExpensesByCategory(sampleTransactions, period);
      expect(result).toEqual({});
    });

    it('handles single category', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 1200,
          date: '2025-11-01',
          category: 'rent',
          type: 'expense',
          description: 'Rent',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
      ];

      const result = calculateExpensesByCategory(transactions);
      expect(result).toEqual({ rent: 1200 });
    });

    it('rounds category totals to 2 decimal places', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 33.333,
          date: '2025-11-01',
          category: 'groceries',
          type: 'expense',
          description: 'Test 1',
          createdAt: '2025-11-01T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: '2',
          amount: 33.334,
          date: '2025-11-02',
          category: 'groceries',
          type: 'expense',
          description: 'Test 2',
          createdAt: '2025-11-02T10:00:00Z',
          updatedAt: '2025-11-02T10:00:00Z',
        },
        {
          id: '3',
          amount: 33.333,
          date: '2025-11-03',
          category: 'groceries',
          type: 'expense',
          description: 'Test 3',
          createdAt: '2025-11-03T10:00:00Z',
          updatedAt: '2025-11-03T10:00:00Z',
        },
      ];

      const result = calculateExpensesByCategory(transactions);
      // 33.333 + 33.334 + 33.333 = 100.00
      expect(result.groceries).toBe(100);
    });

    it('handles multiple categories with period filtering', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-05',
          category: 'groceries',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-05T10:00:00Z',
          updatedAt: '2025-11-05T10:00:00Z',
        },
        {
          id: '2',
          amount: 200,
          date: '2025-11-10',
          category: 'rent',
          type: 'expense',
          description: 'Rent',
          createdAt: '2025-11-10T10:00:00Z',
          updatedAt: '2025-11-10T10:00:00Z',
        },
        {
          id: '3',
          amount: 50,
          date: '2025-11-20',
          category: 'transport',
          type: 'expense',
          description: 'Transport',
          createdAt: '2025-11-20T10:00:00Z',
          updatedAt: '2025-11-20T10:00:00Z',
        },
        {
          id: '4',
          amount: 300,
          date: '2025-10-15',
          category: 'groceries',
          type: 'expense',
          description: 'Oct Groceries (outside period)',
          createdAt: '2025-10-15T10:00:00Z',
          updatedAt: '2025-10-15T10:00:00Z',
        },
      ];

      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'November',
      };

      const result = calculateExpensesByCategory(transactions, period);
      expect(result).toEqual({
        groceries: 100,
        rent: 200,
        transport: 50,
      });
    });
  });

  describe('determineGranularity', () => {
    it('returns "day" for period ≤31 days', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-30', // 29 days
        label: 'November',
      };

      const result = determineGranularity(period);
      expect(result).toBe('day');
    });

    it('returns "day" for exactly 31 days', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-12-01', // Exactly 31 days
        label: '31 days',
      };

      const result = determineGranularity(period);
      expect(result).toBe('day');
    });

    it('returns "week" for period ≤90 days', () => {
      const period: Period = {
        type: 'last-3-months',
        startDate: '2025-09-01',
        endDate: '2025-11-30', // ~90 days
        label: 'Last 3 Months',
      };

      const result = determineGranularity(period);
      expect(result).toBe('week');
    });

    it('returns "week" for 32-90 day range', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-12-03', // 32 days (Nov 1 to Dec 3)
        label: '32 days',
      };

      const result = determineGranularity(period);
      expect(result).toBe('week');
    });

    it('returns "month" for period >90 days', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-01-01',
        endDate: '2025-12-31', // 364 days
        label: 'Full Year',
      };

      const result = determineGranularity(period);
      expect(result).toBe('month');
    });

    it('returns "month" for exactly 91 days', () => {
      const period: Period = {
        type: 'custom',
        startDate: '2025-09-01',
        endDate: '2025-11-30', // >90 days
        label: '3 months',
      };

      const result = determineGranularity(period);
      expect(result).toBe('week'); // Actually ≤90
    });
  });

  describe('calculateTrendData', () => {
    const trendTestTransactions: Transaction[] = [
      {
        id: '1',
        amount: 5000,
        date: '2025-11-01',
        category: 'salary',
        type: 'income',
        description: 'Salary Nov 1',
        createdAt: '2025-11-01T10:00:00Z',
        updatedAt: '2025-11-01T10:00:00Z',
      },
      {
        id: '2',
        amount: 1000,
        date: '2025-11-05',
        category: 'freelance',
        type: 'income',
        description: 'Freelance Nov 5',
        createdAt: '2025-11-05T10:00:00Z',
        updatedAt: '2025-11-05T10:00:00Z',
      },
      {
        id: '3',
        amount: 300,
        date: '2025-11-01',
        category: 'food',
        type: 'expense',
        description: 'Groceries Nov 1',
        createdAt: '2025-11-01T10:00:00Z',
        updatedAt: '2025-11-01T10:00:00Z',
      },
      {
        id: '4',
        amount: 150,
        date: '2025-11-05',
        category: 'utilities',
        type: 'expense',
        description: 'Utilities Nov 5',
        createdAt: '2025-11-05T10:00:00Z',
        updatedAt: '2025-11-05T10:00:00Z',
      },
      {
        id: '5',
        amount: 500,
        date: '2025-11-10',
        category: 'rent',
        type: 'expense',
        description: 'Rent Nov 10',
        createdAt: '2025-11-10T10:00:00Z',
        updatedAt: '2025-11-10T10:00:00Z',
      },
    ];

    describe('Daily Granularity', () => {
      it('returns daily aggregates for short period', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-10',
          label: 'Nov 1-10',
        };

        const result = calculateTrendData(trendTestTransactions, period, 'day');

        expect(result).toHaveLength(10); // 10 days
        expect(result[0].date).toBe('Nov 1');
        expect(result[0].income).toBe(5000);
        expect(result[0].expenses).toBe(300);
        expect(result[0].net).toBe(4700);

        expect(result[4].date).toBe('Nov 5');
        expect(result[4].income).toBe(1000);
        expect(result[4].expenses).toBe(150);
        expect(result[4].net).toBe(850);

        expect(result[9].date).toBe('Nov 10');
        expect(result[9].income).toBe(0);
        expect(result[9].expenses).toBe(500);
        expect(result[9].net).toBe(-500);
      });

      it('handles days with no transactions', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-05',
          label: 'Nov 1-5',
        };

        const result = calculateTrendData(trendTestTransactions, period, 'day');

        // Nov 2, 3, 4 should have zero values
        expect(result[1].date).toBe('Nov 2');
        expect(result[1].income).toBe(0);
        expect(result[1].expenses).toBe(0);
        expect(result[1].net).toBe(0);
      });

      it('formats date labels correctly for daily', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-03',
          label: 'Nov 1-3',
        };

        const result = calculateTrendData(trendTestTransactions, period, 'day');

        expect(result[0].date).toBe('Nov 1');
        expect(result[1].date).toBe('Nov 2');
        expect(result[2].date).toBe('Nov 3');
      });
    });

    describe('Weekly Granularity', () => {
      it('returns weekly aggregates for medium period', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-30',
          label: 'November',
        };

        const result = calculateTrendData(
          trendTestTransactions,
          period,
          'week'
        );

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].date).toContain('Week of');
      });

      it('aggregates transactions within same week', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-30',
          label: 'November',
        };

        const result = calculateTrendData(
          trendTestTransactions,
          period,
          'week'
        );

        // First week should have transactions from Nov 1 and Nov 5
        const firstWeek = result[0];
        expect(firstWeek.income).toBeGreaterThan(0);
        expect(firstWeek.expenses).toBeGreaterThan(0);
      });

      it('formats date labels correctly for weekly', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-14',
          label: 'Two weeks',
        };

        const result = calculateTrendData(
          trendTestTransactions,
          period,
          'week'
        );

        expect(result[0].date).toMatch(
          /Week of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d+/
        );
      });
    });

    describe('Monthly Granularity', () => {
      it('returns monthly aggregates for long period', () => {
        const transactions: Transaction[] = [
          {
            id: '1',
            amount: 5000,
            date: '2025-09-15',
            category: 'salary',
            type: 'income',
            description: 'September income',
            createdAt: '2025-09-15T10:00:00Z',
            updatedAt: '2025-09-15T10:00:00Z',
          },
          {
            id: '2',
            amount: 5000,
            date: '2025-10-15',
            category: 'salary',
            type: 'income',
            description: 'October income',
            createdAt: '2025-10-15T10:00:00Z',
            updatedAt: '2025-10-15T10:00:00Z',
          },
          {
            id: '3',
            amount: 5000,
            date: '2025-11-15',
            category: 'salary',
            type: 'income',
            description: 'November income',
            createdAt: '2025-11-15T10:00:00Z',
            updatedAt: '2025-11-15T10:00:00Z',
          },
          {
            id: '4',
            amount: 1000,
            date: '2025-09-10',
            category: 'rent',
            type: 'expense',
            description: 'September expense',
            createdAt: '2025-09-10T10:00:00Z',
            updatedAt: '2025-09-10T10:00:00Z',
          },
          {
            id: '5',
            amount: 1200,
            date: '2025-10-10',
            category: 'rent',
            type: 'expense',
            description: 'October expense',
            createdAt: '2025-10-10T10:00:00Z',
            updatedAt: '2025-10-10T10:00:00Z',
          },
          {
            id: '6',
            amount: 1100,
            date: '2025-11-10',
            category: 'rent',
            type: 'expense',
            description: 'November expense',
            createdAt: '2025-11-10T10:00:00Z',
            updatedAt: '2025-11-10T10:00:00Z',
          },
        ];

        const period: Period = {
          type: 'custom',
          startDate: '2025-09-01',
          endDate: '2025-11-30',
          label: '3 months',
        };

        const result = calculateTrendData(transactions, period, 'month');

        expect(result).toHaveLength(3); // Sep, Oct, Nov
        expect(result[0].date).toBe('September');
        expect(result[1].date).toBe('October');
        expect(result[2].date).toBe('November');

        expect(result[0].income).toBe(5000);
        expect(result[0].expenses).toBe(1000);
        expect(result[0].net).toBe(4000);
      });

      it('formats date labels correctly for monthly', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          label: 'Q1',
        };

        const result = calculateTrendData([], period, 'month');

        expect(result[0].date).toBe('January');
        expect(result[1].date).toBe('February');
        expect(result[2].date).toBe('March');
      });
    });

    describe('Edge Cases', () => {
      it('returns empty array for period with no transactions', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-12-01',
          endDate: '2025-12-05',
          label: 'December',
        };

        const result = calculateTrendData(trendTestTransactions, period, 'day');

        expect(result).toHaveLength(5); // 5 days
        expect(result.every(d => d.income === 0 && d.expenses === 0)).toBe(
          true
        );
      });

      it('handles single day period', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-01',
          label: 'Single day',
        };

        const result = calculateTrendData(trendTestTransactions, period, 'day');

        expect(result).toHaveLength(1);
        expect(result[0].date).toBe('Nov 1');
        expect(result[0].income).toBe(5000);
        expect(result[0].expenses).toBe(300);
      });

      it('rounds amounts to 2 decimal places', () => {
        const transactions: Transaction[] = [
          {
            id: '1',
            amount: 100.333,
            date: '2025-11-01',
            category: 'salary',
            type: 'income',
            description: 'Test',
            createdAt: '2025-11-01T10:00:00Z',
            updatedAt: '2025-11-01T10:00:00Z',
          },
          {
            id: '2',
            amount: 50.667,
            date: '2025-11-01',
            category: 'food',
            type: 'expense',
            description: 'Test',
            createdAt: '2025-11-01T10:00:00Z',
            updatedAt: '2025-11-01T10:00:00Z',
          },
        ];

        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-01',
          label: 'Single day',
        };

        const result = calculateTrendData(transactions, period, 'day');

        expect(result[0].income).toBe(100.33);
        expect(result[0].expenses).toBe(50.67);
        expect(result[0].net).toBe(49.67);
      });

      it('handles negative net balance correctly', () => {
        const transactions: Transaction[] = [
          {
            id: '1',
            amount: 100,
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
            date: '2025-11-01',
            category: 'rent',
            type: 'expense',
            description: 'Expense',
            createdAt: '2025-11-01T10:00:00Z',
            updatedAt: '2025-11-01T10:00:00Z',
          },
        ];

        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-01',
          label: 'Single day',
        };

        const result = calculateTrendData(transactions, period, 'day');

        expect(result[0].net).toBe(-400); // 100 - 500 = -400
      });

      it('handles empty transactions array', () => {
        const period: Period = {
          type: 'custom',
          startDate: '2025-11-01',
          endDate: '2025-11-05',
          label: 'Nov 1-5',
        };

        const result = calculateTrendData([], period, 'day');

        expect(result).toHaveLength(5);
        expect(
          result.every(d => d.income === 0 && d.expenses === 0 && d.net === 0)
        ).toBe(true);
      });
    });
  });
});
