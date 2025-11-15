/**
 * Income vs Expenses Trend Chart Component
 *
 * Displays a bar chart showing income and expense trends over time with adaptive granularity.
 * Uses Recharts BarChart for visualization with green income bars and red expense bars.
 *
 * @module components/dashboard/IncomeTrendChart
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import {
  calculateTrendData,
  determineGranularity,
  type TrendDataPoint,
} from '../../services/calculationService';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Period } from '../../models/Period';

/**
 * Props for IncomeTrendChart component
 */
interface IncomeTrendChartProps {
  /** Optional period override. If not provided, uses selectedPeriod from AppContext */
  period?: Period;
}

/**
 * Custom tooltip component for the trend chart
 *
 * Displays date, income, expenses, and color-coded net balance on hover.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TrendDataPoint }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Extract data from payload
  const data = payload[0].payload as TrendDataPoint;
  const net = data.net;
  const netColor = net >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
      <p className="font-semibold text-gray-900 mb-2">{data.date}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-green-600">Income:</span>
          <span className="font-semibold">{formatCurrency(data.income)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-red-600">Expenses:</span>
          <span className="font-semibold">{formatCurrency(data.expenses)}</span>
        </div>
        <div className="border-t border-gray-200 pt-1 mt-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-700">Net Balance:</span>
            <span className={`font-bold ${netColor}`}>
              {net >= 0 ? '+' : ''}
              {formatCurrency(net)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Income vs Expenses Trend Chart Component
 *
 * Features:
 * - Adaptive granularity: daily (≤31 days), weekly (≤90 days), monthly (>90 days)
 * - Green bars for income (#10B981)
 * - Red bars for expenses (#EF4444)
 * - Interactive tooltip with net balance calculation
 * - Empty state handling
 * - Responsive design with ResponsiveContainer
 *
 * @param props - Component props
 * @returns Rendered chart or empty state
 */
export const IncomeTrendChart: React.FC<IncomeTrendChartProps> = ({
  period,
}) => {
  const { transactions, selectedPeriod } = useAppContext();
  const activePeriod = period || selectedPeriod;

  // Determine granularity based on period length
  const granularity = useMemo(
    () => determineGranularity(activePeriod),
    [activePeriod]
  );

  // Calculate trend data with memoization for performance
  const chartData = useMemo(
    () => calculateTrendData(transactions, activePeriod, granularity),
    [transactions, activePeriod, granularity]
  );

  // Check if data is empty (no transactions in period)
  const isEmpty =
    chartData.length === 0 ||
    chartData.every(d => d.income === 0 && d.expenses === 0);

  // Render empty state
  if (isEmpty) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Income vs Expenses Trend
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600">No transactions in this period</p>
        </div>
      </div>
    );
  }

  // Render chart
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Income vs Expenses Trend
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tickFormatter={value => formatCurrency(value)}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{
              value: 'Amount (USD)',
              angle: -90,
              position: 'insideLeft',
              fill: '#6b7280',
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
          <Bar
            dataKey="income"
            fill="#10B981"
            name="Income"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill="#EF4444"
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
