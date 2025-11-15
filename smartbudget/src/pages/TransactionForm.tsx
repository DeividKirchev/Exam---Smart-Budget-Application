import React from 'react';
import { useParams } from 'react-router-dom';

interface TransactionFormProps {
  mode: 'create' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>
        {mode === 'create' ? 'Add Transaction' : `Edit Transaction #${id}`}
      </h1>
      <p>Form implementation in Epic 3</p>
    </div>
  );
};

export default TransactionForm;
