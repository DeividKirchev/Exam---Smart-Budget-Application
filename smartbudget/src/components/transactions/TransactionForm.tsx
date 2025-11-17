/**
 * TransactionForm Component
 *
 * Reusable form component for creating and editing transactions.
 * Supports dual-mode operation (create/edit) with comprehensive client-side validation.
 *
 * @module components/transactions/TransactionForm
 */

import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import type { Transaction } from '../../models/Transaction';
import { useAppContext } from '../../context/AppContext';
import { getCategoriesByType } from '../../constants/categories';
import {
  validateAmount,
  validateDate,
  sanitizeDescription,
} from '../../utils/validators';

/**
 * Props interface for TransactionForm component
 *
 * @interface TransactionFormProps
 * @property {('create' | 'edit')} mode - Form mode (create or edit)
 * @property {Transaction} [transaction] - Transaction data (required if mode='edit')
 * @property {(transaction: Transaction) => void} onSave - Callback invoked on successful save
 * @property {() => void} onCancel - Callback invoked when user cancels
 */
export interface TransactionFormProps {
  /** Form mode: 'create' for new transaction, 'edit' for existing */
  mode: 'create' | 'edit';

  /** Existing transaction data (required when mode='edit') */
  transaction?: Transaction;

  /** Success callback - receives created/updated transaction */
  onSave: (transaction: Transaction) => void;

  /** Cancel callback - invoked when user cancels form */
  onCancel: () => void;
}

/**
 * Form field errors interface
 */
interface FormErrors {
  amount?: string;
  type?: string;
  category?: string;
  date?: string;
  description?: string;
}

/**
 * TransactionForm Component
 *
 * Provides a comprehensive form for transaction entry with:
 * - Dual-mode support (create/edit)
 * - Client-side validation
 * - Category filtering by transaction type
 * - Responsive design
 * - Accessibility features
 * - Loading states
 *
 * @example
 * ```tsx
 * <TransactionForm
 *   mode="create"
 *   onSave={(transaction) => navigate('/transactions')}
 *   onCancel={() => navigate('/transactions')}
 * />
 * ```
 */
const TransactionForm: React.FC<TransactionFormProps> = ({
  mode,
  transaction,
  onSave,
  onCancel,
}) => {
  const { addTransaction, updateTransaction } = useAppContext();

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Form field states
  const [amount, setAmount] = useState<string>(
    transaction?.amount.toString() ?? ''
  );
  const [type, setType] = useState<'income' | 'expense'>(
    transaction?.type ?? 'expense'
  );
  const [category, setCategory] = useState<string>(transaction?.category ?? '');
  const [date, setDate] = useState<string>(transaction?.date ?? getTodayDate());
  const [description, setDescription] = useState<string>(
    transaction?.description ?? ''
  );

  // UI states
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Ref for amount input autofocus
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Focus amount field on mount
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  // Filter categories by type
  const filteredCategories = getCategoriesByType(type);

  // Reset category if it doesn't match the new type
  useEffect(() => {
    if (category) {
      const categoryExists = filteredCategories.some(c => c.id === category);
      if (!categoryExists) {
        setCategory('');
      }
    }
  }, [type, category, filteredCategories]);

  /**
   * Validates a single form field
   */
  const validateField = (
    fieldName: keyof FormErrors,
    value: string | number
  ): string | null => {
    switch (fieldName) {
      case 'amount': {
        const amountValue =
          typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(amountValue)) {
          return 'Please enter a valid number';
        }
        const result = validateAmount(amountValue);
        return result.valid ? null : (result.error ?? 'Invalid amount');
      }

      case 'category':
        return !value ? 'Please select a category' : null;

      case 'date': {
        const dateStr = value.toString();
        const result = validateDate(dateStr);
        if (!result.valid) {
          return result.error ?? 'Invalid date';
        }
        // Check for future date - compare date strings to avoid timezone issues
        const today = new Date().toISOString().split('T')[0];
        if (dateStr > today) {
          return 'Please select a valid date (not in the future)';
        }
        return null;
      }

      case 'description':
        return value.toString().length > 200
          ? 'Description must be 200 characters or less'
          : null;

      default:
        return null;
    }
  };

  /**
   * Handles field blur for validation
   */
  const handleBlur = (fieldName: keyof FormErrors, value: string | number) => {
    const error = validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error ?? undefined,
    }));
  };

  /**
   * Validates all form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const amountError = validateField('amount', amount);
    if (amountError) newErrors.amount = amountError;

    const categoryError = validateField('category', category);
    if (categoryError) newErrors.category = categoryError;

    const dateError = validateField('date', date);
    if (dateError) newErrors.date = dateError;

    const descriptionError = validateField('description', description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Resets form to default state
   */
  const resetForm = () => {
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(getTodayDate());
    setDescription('');
    setErrors({});

    // Refocus amount field
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  };

  /**
   * Shows success toast message
   */
  const showSuccessToast = (message: string) => {
    setShowSuccess(true);
    console.log('✓', message);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build transaction data
      const transactionData = {
        amount: parseFloat(amount),
        type,
        category,
        date,
        description: sanitizeDescription(description),
      };

      let result: Transaction;

      if (mode === 'create') {
        // Create new transaction
        result = await addTransaction(transactionData);
        showSuccessToast('Transaction added successfully');
        resetForm();
      } else {
        // Update existing transaction
        if (!transaction?.id) {
          throw new Error('Transaction ID is required for edit mode');
        }
        result = await updateTransaction(transaction.id, transactionData);
        showSuccessToast('Transaction updated successfully');
      }

      // Call success callback
      onSave(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save transaction';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Toast */}
      {showSuccess && (
        <div
          className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          {mode === 'create'
            ? 'Transaction added successfully'
            : 'Transaction updated successfully'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Amount and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              ref={amountInputRef}
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onBlur={e => handleBlur('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              aria-label="Transaction amount"
            />
            {errors.amount && (
              <p
                id="amount-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.amount}
              </p>
            )}
          </div>

          {/* Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={e =>
                    setType(e.target.value as 'income' | 'expense')
                  }
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Income</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={e =>
                    setType(e.target.value as 'income' | 'expense')
                  }
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Expense</span>
              </label>
            </div>
          </div>
        </div>

        {/* Category and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              onBlur={e => handleBlur('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? 'category-error' : undefined}
              aria-label="Transaction category"
            >
              <option value="">Select category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p
                id="category-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.category}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              max={getTodayDate()}
              value={date}
              onChange={e => setDate(e.target.value)}
              onBlur={e => handleBlur('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'date-error' : undefined}
              aria-label="Transaction date"
            />
            {errors.date && (
              <p
                id="date-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description{' '}
            <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={200}
            placeholder="Add a note (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={e => handleBlur('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description
                ? 'description-error description-counter'
                : 'description-counter'
            }
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && (
              <p
                id="description-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.description}
              </p>
            )}
            <p
              id="description-counter"
              className={`text-sm ${errors.description ? 'text-red-600' : 'text-gray-500'} ml-auto`}
            >
              {description.length}/200
            </p>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            role="alert"
          >
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-11"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-11 min-w-32"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : mode === 'create' ? (
              'Add Transaction'
            ) : (
              'Update Transaction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
