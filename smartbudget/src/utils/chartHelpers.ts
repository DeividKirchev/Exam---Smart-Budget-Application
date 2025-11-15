/**
 * Chart Helpers
 *
 * Utility functions for transforming data into chart-ready formats.
 * Used by dashboard chart components (ExpenseBreakdownChart, etc.)
 *
 * @module utils/chartHelpers
 */

import { getCategoryById } from '../constants/categories';

/**
 * Pie chart data item interface
 *
 * Format expected by Recharts PieChart component.
 * Each item represents a slice of the pie with name, value, color, and percentage.
 */
export interface PieChartDataItem {
  /**
   * Display name for the category (e.g., "Food/Groceries")
   */
  name: string;

  /**
   * Numeric value for this slice (e.g., total expense amount)
   */
  value: number;

  /**
   * Hex color code for this slice (from category constants)
   */
  fill: string;

  /**
   * Percentage of total (integer, 0-100)
   * Percentages are guaranteed to sum to exactly 100%
   */
  percentage: number;
}

/**
 * Transform expenses by category to pie chart data
 *
 * Converts the output of calculateExpensesByCategory into Recharts-compatible format.
 * - Looks up category name and color from constants
 * - Calculates percentage for each category
 * - Filters out categories with zero amounts
 * - Ensures percentages sum to exactly 100% (handles rounding)
 *
 * @param expensesByCategory - Object mapping category ID to total amount
 * @returns Array of pie chart data items, sorted by value descending
 *
 * @example
 * const expenses = { "food": 150, "rent": 200, "transport": 50 };
 * const chartData = transformToPieChartData(expenses);
 * // Returns:
 * // [
 * //   { name: "Rent", value: 200, fill: "#EF4444", percentage: 50 },
 * //   { name: "Food/Groceries", value: 150, fill: "#B91C1C", percentage: 38 },
 * //   { name: "Transport", value: 50, fill: "#...", percentage: 12 }
 * // ]
 * // Note: percentages sum to 100 (50 + 38 + 12 = 100)
 */
export const transformToPieChartData = (
  expensesByCategory: Record<string, number>
): PieChartDataItem[] => {
  // Calculate total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce(
    (sum, val) => sum + val,
    0
  );

  // Return empty array if no expenses
  if (totalExpenses === 0) return [];

  // Transform to chart data items
  const data = Object.entries(expensesByCategory)
    .filter(([, amount]) => amount > 0) // Filter out zero amounts
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categoryId);
      const percentage = Math.round((amount / totalExpenses) * 100);

      return {
        name: category?.name || 'Unknown',
        value: Math.round(amount * 100) / 100, // Round to 2 decimals
        fill: category?.color || '#9CA3AF', // Gray fallback for unknown categories
        percentage,
      };
    });

  // Ensure percentages sum to exactly 100% (handle rounding errors)
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);
  if (totalPercentage !== 100 && data.length > 0) {
    const diff = 100 - totalPercentage;
    // Adjust the largest category by the difference
    const maxItem = data.reduce((max, item) =>
      item.value > max.value ? item : max
    );
    maxItem.percentage += diff;
  }

  // Sort by value descending (largest slice first)
  return data.sort((a, b) => b.value - a.value);
};
