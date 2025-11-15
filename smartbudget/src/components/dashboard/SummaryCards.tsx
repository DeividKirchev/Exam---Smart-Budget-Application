/**
 * SummaryCards Component
 *
 * Displays financial summary statistics in card format:
 * - Total Income (green, TrendingUp icon)
 * - Total Expenses (red, TrendingDown icon)
 * - Net Balance (conditional color, Wallet icon)
 *
 * Cards are responsive: stacked on mobile (<768px), 3-column grid on desktop.
 * Calculations are memoized and update automatically when transactions change.
 *
 * @module components/dashboard/SummaryCards
 */

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Period } from '../../models/Period';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
} from '../../services/calculationService';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Props interface for SummaryCards component
 */
interface SummaryCardsProps {
  /**
   * Optional period for filtering transactions by date range
   * If not provided, calculations use all transactions
   */
  period?: Period;
}

/**
 * SummaryCards component displaying financial summary metrics
 *
 * @param props - Component props
 * @returns JSX element containing three summary cards
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({ period }) => {
  const { transactions } = useAppContext();

  // Memoized calculations - recalculate only when transactions or period changes
  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions, period),
    [transactions, period]
  );

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(transactions, period),
    [transactions, period]
  );

  const netBalance = useMemo(
    () => calculateNetBalance(transactions, period),
    [transactions, period]
  );

  // Conditional color class for net balance based on value
  const balanceColorClass =
    netBalance > 0
      ? 'text-green-600'
      : netBalance < 0
        ? 'text-red-600'
        : 'text-gray-600';

  const balanceIconColorClass =
    netBalance > 0
      ? 'text-green-500'
      : netBalance < 0
        ? 'text-red-500'
        : 'text-gray-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Total Income Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${balanceColorClass}`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
          <div
            className={`${balanceIconColorClass === 'text-green-500' ? 'bg-green-100' : balanceIconColorClass === 'text-red-500' ? 'bg-red-100' : 'bg-gray-100'} p-3 rounded-full`}
          >
            <Wallet className={`w-6 h-6 ${balanceIconColorClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
