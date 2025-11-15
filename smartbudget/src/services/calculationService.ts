/**
 * Calculation Service
 *
 * Centralized financial calculation service for the SmartBudget application.
 * All calculations follow standardized formulas from architecture.md to prevent agent inconsistencies.
 *
 * @module services/calculationService
 */

import {
  parseISO,
  isWithinInterval,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfWeek,
  startOfMonth,
  format,
  isWithinInterval as checkWithinInterval,
} from 'date-fns';
import type { Transaction } from '../models/Transaction';
import type { Period } from '../models/Period';

/**
 * Helper function to check if a transaction date is within a period
 *
 * @param date - Transaction date in ISO 8601 format (YYYY-MM-DD)
 * @param period - Period with startDate and endDate
 * @returns true if date is within period (inclusive), false otherwise
 */
const isWithinPeriod = (date: string, period: Period): boolean => {
  const transactionDate = parseISO(date);
  const start = parseISO(period.startDate);
  const end = parseISO(period.endDate);

  return isWithinInterval(transactionDate, { start, end });
};

/**
 * Calculate total income from transactions
 *
 * Sums all income transactions, optionally filtered by period.
 * Returns 0 for empty arrays.
 *
 * @param transactions - Array of transactions to process
 * @param period - Optional period for filtering by date range
 * @returns Total income amount, rounded to 2 decimal places
 */
export const calculateTotalIncome = (
  transactions: Transaction[],
  period?: Period
): number => {
  const filtered = period
    ? transactions.filter(
        t => t.type === 'income' && isWithinPeriod(t.date, period)
      )
    : transactions.filter(t => t.type === 'income');

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  return Math.round(total * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate total expenses from transactions
 *
 * Sums all expense transactions, optionally filtered by period.
 * Returns 0 for empty arrays.
 *
 * @param transactions - Array of transactions to process
 * @param period - Optional period for filtering by date range
 * @returns Total expenses amount, rounded to 2 decimal places
 */
export const calculateTotalExpenses = (
  transactions: Transaction[],
  period?: Period
): number => {
  const filtered = period
    ? transactions.filter(
        t => t.type === 'expense' && isWithinPeriod(t.date, period)
      )
    : transactions.filter(t => t.type === 'expense');

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  return Math.round(total * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate net balance (income - expenses)
 *
 * Computes net balance by subtracting total expenses from total income,
 * optionally filtered by period. Returns 0 for empty arrays.
 *
 * @param transactions - Array of transactions to process
 * @param period - Optional period for filtering by date range
 * @returns Net balance, rounded to 2 decimal places
 */
export const calculateNetBalance = (
  transactions: Transaction[],
  period?: Period
): number => {
  const income = calculateTotalIncome(transactions, period);
  const expenses = calculateTotalExpenses(transactions, period);
  return Math.round((income - expenses) * 100) / 100;
};

/**
 * Calculate expenses grouped by category
 *
 * Aggregates all expense transactions by category ID, optionally filtered by period.
 * Only includes expense transactions (type='expense').
 * Returns empty object when no expenses exist.
 *
 * @param transactions - Array of transactions to process
 * @param period - Optional period for filtering by date range
 * @returns Object mapping category ID to total amount for that category
 *
 * @example
 * const expenses = calculateExpensesByCategory(transactions);
 * // Returns: { "food": 150.00, "rent": 1200.00, "transport": 50.00 }
 *
 * const periodExpenses = calculateExpensesByCategory(transactions, thisMonthPeriod);
 * // Returns only expenses within the specified period
 */
export const calculateExpensesByCategory = (
  transactions: Transaction[],
  period?: Period
): Record<string, number> => {
  // Filter for expense transactions only
  let filtered = transactions.filter(t => t.type === 'expense');

  // Apply period filter if provided
  if (period) {
    filtered = filtered.filter(t => isWithinPeriod(t.date, period));
  }

  // Aggregate by category
  const expensesByCategory = filtered.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Round each category total to 2 decimal places
  Object.keys(expensesByCategory).forEach(categoryId => {
    expensesByCategory[categoryId] =
      Math.round(expensesByCategory[categoryId] * 100) / 100;
  });

  return expensesByCategory;
};

/**
 * Trend Data Point Interface
 *
 * Represents a single data point in the income vs expenses trend chart.
 * Each point corresponds to a time bucket (day, week, or month).
 */
export interface TrendDataPoint {
  /** Formatted date label for display (e.g., "Nov 10", "Week of Nov 5", "November") */
  date: string;
  /** Total income for this time bucket */
  income: number;
  /** Total expenses for this time bucket */
  expenses: number;
  /** Net balance (income - expenses) for this time bucket */
  net: number;
}

/**
 * Determine appropriate granularity based on period length
 *
 * Adaptive granularity logic:
 * - ≤31 days: Daily granularity
 * - ≤90 days: Weekly granularity
 * - >90 days: Monthly granularity
 *
 * @param period - The time period to analyze
 * @returns The appropriate granularity level
 */
export const determineGranularity = (
  period: Period
): 'day' | 'week' | 'month' => {
  const start = parseISO(period.startDate);
  const end = parseISO(period.endDate);
  const dayDiff = differenceInDays(end, start);

  if (dayDiff <= 31) return 'day';
  if (dayDiff <= 90) return 'week';
  return 'month';
};

/**
 * Calculate trend data for income vs expenses chart
 *
 * Aggregates transactions into time buckets based on granularity.
 * Each bucket contains total income, total expenses, and net balance.
 *
 * @param transactions - Array of all transactions
 * @param period - Time period for filtering and bucketing
 * @param granularity - Time bucket size ('day', 'week', or 'month')
 * @returns Array of trend data points, one per time bucket
 *
 * @example
 * const trendData = calculateTrendData(transactions, thisMonthPeriod, 'day');
 * // Returns: [
 * //   { date: "Nov 1", income: 0, expenses: 50, net: -50 },
 * //   { date: "Nov 2", income: 1500, expenses: 0, net: 1500 },
 * //   ...
 * // ]
 */
export const calculateTrendData = (
  transactions: Transaction[],
  period: Period,
  granularity: 'day' | 'week' | 'month'
): TrendDataPoint[] => {
  const start = parseISO(period.startDate);
  const end = parseISO(period.endDate);

  // Generate date intervals based on granularity
  let intervals: Date[];
  if (granularity === 'day') {
    intervals = eachDayOfInterval({ start, end });
  } else if (granularity === 'week') {
    intervals = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 }); // Sunday start
  } else {
    intervals = eachMonthOfInterval({ start, end });
  }

  // Helper function to check if a transaction falls within a time bucket
  const isInBucket = (transactionDate: string, bucketDate: Date): boolean => {
    const txDate = parseISO(transactionDate);

    if (granularity === 'day') {
      // Same day
      return format(txDate, 'yyyy-MM-dd') === format(bucketDate, 'yyyy-MM-dd');
    } else if (granularity === 'week') {
      // Within the same week
      const weekStart = startOfWeek(bucketDate, { weekStartsOn: 0 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return checkWithinInterval(txDate, { start: weekStart, end: weekEnd });
    } else {
      // Within the same month
      const monthStart = startOfMonth(bucketDate);
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
      );
      return checkWithinInterval(txDate, { start: monthStart, end: monthEnd });
    }
  };

  // Helper function to format date labels based on granularity
  const formatDateLabel = (date: Date): string => {
    if (granularity === 'day') {
      return format(date, 'MMM d'); // "Nov 10"
    } else if (granularity === 'week') {
      return `Week of ${format(date, 'MMM d')}`; // "Week of Nov 5"
    } else {
      return format(date, 'MMMM'); // "November"
    }
  };

  // Aggregate transactions into time buckets
  return intervals.map(bucketDate => {
    const income = transactions
      .filter(t => t.type === 'income' && isInBucket(t.date, bucketDate))
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && isInBucket(t.date, bucketDate))
      .reduce((sum, t) => sum + t.amount, 0);

    const net = income - expenses;

    return {
      date: formatDateLabel(bucketDate),
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      net: Math.round(net * 100) / 100,
    };
  });
};
