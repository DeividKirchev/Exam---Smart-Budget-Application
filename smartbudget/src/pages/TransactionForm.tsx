import React from 'react';
import { useParams } from 'react-router-dom';

interface TransactionFormProps {
  mode: 'create' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {mode === 'create' ? 'Add Transaction' : `Edit Transaction #${id}`}
      </h1>
      <p className="text-gray-600">Form implementation in Epic 3</p>
    </div>
  );
};

export default TransactionForm;
