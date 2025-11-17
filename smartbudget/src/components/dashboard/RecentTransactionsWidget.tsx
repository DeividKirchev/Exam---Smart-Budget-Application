/**
 * Recent Transactions Widget Component
 *
 * Displays a compact list of the most recent transactions within the selected period.
 * Provides quick access to latest financial activity with "View All" navigation.
 *
 * @module components/dashboard/RecentTransactionsWidget
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Receipt, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { CategoryBadge } from '../common/CategoryBadge';
import { getCategoryById } from '../../constants/categories';
import type { Period } from '../../models/Period';
import type { Transaction } from '../../models/Transaction';
import { EmptyState } from '../common/EmptyState';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * Props for RecentTransactionsWidget component
 */
interface RecentTransactionsWidgetProps {
  /** Optional period override. If not provided, uses selectedPeriod from AppContext */
  period?: Period;
  /** Maximum number of transactions to display (default: 5) */
  limit?: number;
}

/**
 * Helper function to check if a transaction is within a period
 */
const isTransactionInPeriod = (
  transaction: Transaction,
  period: Period
): boolean => {
  const txDate = parseISO(transaction.date);
  const start = parseISO(period.startDate);
  const end = parseISO(period.endDate);
  return isWithinInterval(txDate, { start, end });
};

/**
 * Recent Transactions Widget Component
 *
 * Features:
 * - Displays last N transactions (default 5, configurable)
 * - Filters by selected period from AppContext
 * - Sorts by date descending (most recent first)
 * - Compact format: date, description, category, amount
 * - Visual type indicators: green income (+), red expense (-)
 * - "View All" link to /transactions route
 * - Empty state handling
 * - Responsive design
 *
 * @param props - Component props
 * @returns Rendered widget or empty state
 */
export const RecentTransactionsWidget: React.FC<
  RecentTransactionsWidgetProps
> = ({ period, limit }) => {
  const { transactions, selectedPeriod } = useAppContext();
  const activePeriod = period || selectedPeriod;

  // Responsive item count: 3-5 on mobile, 8 on desktop
  const isMobile = useMediaQuery('(max-width: 767px)');
  const responsiveLimit = limit || (isMobile ? 3 : 8);

  // Filter, sort, and limit transactions with memoization
  const recentTransactions = useMemo(() => {
    return transactions
      .filter(t => isTransactionInPeriod(t, activePeriod))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, responsiveLimit);
  }, [transactions, activePeriod, responsiveLimit]);

  // Render empty state
  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-6 pb-0 text-gray-900">
          Recent Transactions
        </h2>
        <EmptyState
          icon={<Receipt size={48} />}
          title="No recent transactions"
          message="No transactions in this period"
          className="py-8"
        />
      </div>
    );
  }

  // Render transactions list
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with "View All" link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Transactions list */}
      <div className="space-y-3">
        {recentTransactions.map(transaction => {
          const category = getCategoryById(transaction.category);
          const isIncome = transaction.type === 'income';
          const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
          const amountPrefix = isIncome ? '+' : '-';

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
            >
              {/* Left side: Date, Description, Category */}
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm text-gray-600">
                  {format(parseISO(transaction.date), 'MMM d')}
                </p>
                <p className="font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="mt-1">
                  {category ? (
                    <CategoryBadge
                      categoryId={transaction.category}
                      variant="compact"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">Unknown</span>
                  )}
                </div>
              </div>

              {/* Right side: Amount */}
              <div className={`font-semibold whitespace-nowrap ${amountColor}`}>
                {amountPrefix}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
