/**
 * ExpenseBreakdownChart Component
 *
 * Displays a pie chart showing expense breakdown by category.
 * Uses Recharts library for chart rendering.
 * Automatically updates when period or transactions change.
 *
 * @module components/dashboard/ExpenseBreakdownChart
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  type TooltipProps,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { calculateExpensesByCategory } from '../../services/calculationService';
import {
  transformToPieChartData,
  type PieChartDataItem,
} from '../../utils/chartHelpers';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Period } from '../../models/Period';

/**
 * ExpenseBreakdownChart component props
 */
export interface ExpenseBreakdownChartProps {
  /**
   * Optional period for filtering expenses
   * If not provided, shows all expenses
   */
  period?: Period;

  /**
   * Optional custom CSS classes
   */
  className?: string;
}

/**
 * Custom tooltip component for pie chart
 *
 * Displays category name, amount (formatted as USD), and percentage
 * when user hovers over a pie slice.
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as PieChartDataItem;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
      <p className="text-red-600 font-medium">
        Amount: {formatCurrency(data.value)}
      </p>
      <p className="text-gray-600">Percentage: {data.percentage}%</p>
    </div>
  );
};

/**
 * ExpenseBreakdownChart Component
 *
 * Renders a pie chart showing expenses grouped by category.
 * Features:
 * - Responsive container that adapts to screen size
 * - Custom tooltip showing category details on hover
 * - Legend showing all categories with colors
 * - Empty state when no expenses exist
 * - Colors from category constants for consistency
 * - Memoized data transformation for performance
 *
 * @example
 * <ExpenseBreakdownChart period={selectedPeriod} />
 */
export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
  period,
  className = '',
}) => {
  const { transactions } = useAppContext();

  // Calculate expenses by category with memoization
  const expensesByCategory = useMemo(
    () => calculateExpensesByCategory(transactions, period),
    [transactions, period]
  );

  // Transform to chart data format with memoization
  const chartData = useMemo(
    () => transformToPieChartData(expensesByCategory),
    [expensesByCategory]
  );

  // Empty state: no expenses in selected period
  if (chartData.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg ${className}`}
      >
        <PieChartIcon
          className="w-16 h-16 text-gray-400 mb-4"
          aria-hidden="true"
        />
        <p className="text-gray-600 text-lg font-medium">
          No expenses in this period
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Add some expense transactions to see the breakdown
        </p>
      </div>
    );
  }

  // Render pie chart with data
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Expense Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            labelLine
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => {
              const item = entry.payload as PieChartDataItem;
              return `${value} (${formatCurrency(item.value)})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
