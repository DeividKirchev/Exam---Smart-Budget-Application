import React from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { PeriodSelector } from '../components/dashboard/PeriodSelector';
import { ExpenseBreakdownChart } from '../components/dashboard/ExpenseBreakdownChart';
import { IncomeTrendChart } from '../components/dashboard/IncomeTrendChart';
import { RecentTransactionsWidget } from '../components/dashboard/RecentTransactionsWidget';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { selectedPeriod } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between px-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <PeriodSelector />
      </div>

      {/* Summary Statistics Cards - filtered by selected period */}
      <SummaryCards period={selectedPeriod} />

      {/* Expense Breakdown Chart - Story 4.3 */}
      <div className="mt-6">
        <ExpenseBreakdownChart period={selectedPeriod} />
      </div>

      {/* Income vs Expenses Trend Chart - Story 4.4 */}
      <div className="mt-6">
        <IncomeTrendChart period={selectedPeriod} />
      </div>

      {/* Recent Transactions Widget - Story 4.5 */}
      <div className="mt-6">
        <RecentTransactionsWidget period={selectedPeriod} limit={5} />
      </div>
    </div>
  );
};

export default Dashboard;
