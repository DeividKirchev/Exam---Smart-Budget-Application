/**
 * TransactionForm Page Component
 *
 * Wrapper page for the TransactionForm component.
 * Handles routing params, data loading, and navigation callbacks.
 *
 * @module pages/TransactionForm
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TransactionFormComponent from '../components/transactions/TransactionForm';
import type { Transaction } from '../models/Transaction';

interface TransactionFormPageProps {
  mode: 'create' | 'edit';
}

/**
 * TransactionForm Page
 *
 * Renders the transaction form in create or edit mode.
 * In edit mode, loads the transaction by ID from context.
 */
const TransactionFormPage: React.FC<TransactionFormPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useAppContext();

  // Find transaction by ID if in edit mode
  const transaction =
    mode === 'edit' && id ? transactions.find(t => t.id === id) : undefined;

  // Handle save success - navigate to transactions list
  const handleSave = (savedTransaction: Transaction) => {
    console.log('Transaction saved:', savedTransaction);
    navigate('/transactions');
  };

  // Handle cancel - navigate back to transactions list
  const handleCancel = () => {
    navigate('/transactions');
  };

  // Show error if transaction not found in edit mode
  if (mode === 'edit' && !transaction) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Transaction not found</p>
          <p className="text-sm mt-1">
            The transaction with ID "{id}" could not be found.
          </p>
          <button
            onClick={() => navigate('/transactions')}
            className="mt-3 text-sm underline hover:no-underline"
          >
            Return to transactions list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
      </h1>

      <TransactionFormComponent
        mode={mode}
        transaction={transaction}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default TransactionFormPage;
