/**
 * TransactionsList Page Component
 *
 * Displays all transactions in a sortable list with responsive layout.
 * Desktop: Table format. Mobile: Card format.
 * Features: sorting, color coding, empty/loading/error states.
 *
 * @module pages/TransactionsList
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getCategoryById } from '../constants/categories';
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileX,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '../models/Transaction';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FilterPanel } from '../components/transactions/FilterPanel';
import { filterTransactions } from '../utils/filterTransactions';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

type SortColumn = 'date' | 'amount' | 'category';
type SortDirection = 'asc' | 'desc';

/**
 * TransactionsList Page Component
 *
 * Main page for viewing and managing all transactions.
 * Supports:
 * - Sorting by date, amount, or category
 * - Responsive table (desktop) and card (mobile) layouts
 * - Color-coded amounts (green for income, red for expenses)
 * - Loading, error, and empty states
 * - Navigation to add/edit transactions
 */
const TransactionsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    transactions,
    loading,
    error,
    refreshData,
    deleteTransaction,
    filters,
  } = useAppContext();

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Filters transactions based on active filters
   */
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filters);
  }, [transactions, filters]);

  /**
   * Sorts filtered transactions based on current sort column and direction
   */
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category': {
          const catA = getCategoryById(a.category)?.name ?? '';
          const catB = getCategoryById(b.category)?.name ?? '';
          comparison = catA.localeCompare(catB);
          break;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredTransactions, sortColumn, sortDirection]);

  /**
   * Handles column header clicks for sorting
   */
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  /**
   * Opens delete confirmation dialog for a transaction
   */
  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
    setDeleteError(null);
    setSuccessMessage(null);
  };

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    try {
      const wasDeleted = await deleteTransaction(transactionToDelete);

      if (wasDeleted) {
        setSuccessMessage('Transaction deleted');
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setDeleteError(
          'Transaction not found. It may have already been deleted.'
        );
      }
    } catch {
      setDeleteError('Failed to delete transaction. Please try again.');
    }
  };

  /**
   * Handles delete cancellation
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
    setDeleteError(null);
  };

  /**
   * Returns color class for amount based on transaction type
   */
  const getAmountColor = (type: 'income' | 'expense'): string => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  /**
   * Formats amount as currency
   */
  const formatAmount = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  /**
   * Renders sort indicator icon for column headers
   */
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;

    return sortDirection === 'asc' ? (
      <ArrowUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1" />
    );
  };

  /**
   * Renders transaction row for desktop table
   */
  const renderTableRow = (transaction: Transaction) => {
    return (
      <tr key={transaction.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-900">
          {format(new Date(transaction.date), 'MM/dd/yyyy')}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          {transaction.description}
        </td>
        <td className="px-4 py-3">
          <CategoryBadge categoryId={transaction.category} variant="compact" />
        </td>
        <td
          className={`px-4 py-3 text-sm font-semibold ${getAmountColor(transaction.type)}`}
        >
          {formatAmount(transaction.amount)}
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              transaction.type === 'income'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit transaction"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(transaction.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Renders transaction card for mobile layout
   */
  const renderCard = (transaction: Transaction) => {
    return (
      <div
        key={transaction.id}
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              {format(new Date(transaction.date), 'MM/dd/yyyy')}
            </div>
            <div className="font-semibold text-gray-900 mb-2">
              {transaction.description}
            </div>
          </div>
          <div
            className={`text-xl font-bold ${getAmountColor(transaction.type)}`}
          >
            {formatAmount(transaction.amount)}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <CategoryBadge categoryId={transaction.category} variant="compact" />
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              transaction.type === 'income'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors min-h-11"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(transaction.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors min-h-11"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <LoadingSpinner message="Loading transactions..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold mb-2">
            Unable to load transactions
          </p>
          <p className="text-red-600 text-sm mb-4">Please try again.</p>
          <button
            onClick={() => refreshData()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state - differentiate between no transactions and filtered empty
  if (transactions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
          <button
            onClick={() => navigate('/transactions/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap sm:min-w-[140px]"
            aria-label="Add new transaction"
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span>Add New</span>
          </button>
        </div>

        <EmptyState
          icon={<FileX size={64} />}
          title="No transactions yet"
          message="Add your first transaction to get started!"
          action={{
            label: 'Add New',
            onClick: () => navigate('/transactions/new'),
          }}
        />
      </div>
    );
  }

  // Main content with transactions
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
          {filteredTransactions.length !== transactions.length && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredTransactions.length} of {transactions.length}{' '}
              transactions
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/transactions/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap sm:min-w-[140px]"
          aria-label="Add new transaction"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Date {renderSortIcon('date')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th
                onClick={() => handleSort('category')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Category {renderSortIcon('category')}
              </th>
              <th
                onClick={() => handleSort('amount')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Amount {renderSortIcon('amount')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{sortedTransactions.map(renderTableRow)}</tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {sortedTransactions.map(renderCard)}
      </div>

      {/* Filtered Empty State */}
      {sortedTransactions.length === 0 && transactions.length > 0 && (
        <EmptyState
          icon={<Filter size={64} />}
          title="No transactions match your filters"
          message="Try adjusting your filters or clearing them to see all transactions."
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Transaction"
        message={
          deleteError ||
          'Are you sure you want to delete this transaction? This action cannot be undone.'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default TransactionsList;
