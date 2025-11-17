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
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <PeriodSelector />
      </div>

      {/* Summary Statistics Cards - filtered by selected period */}
      <SummaryCards period={selectedPeriod} />

      {/* Charts - Stack vertically for better layout */}
      <div className="mt-6 space-y-6">
        {/* Income vs Expenses Trend Chart */}
        <IncomeTrendChart period={selectedPeriod} />

        {/* Expense Breakdown Chart */}
        <ExpenseBreakdownChart period={selectedPeriod} />
      </div>

      {/* Recent Transactions Widget */}
      <div className="mt-6">
        <RecentTransactionsWidget period={selectedPeriod} />
      </div>
    </div>
  );
};

export default Dashboard;
