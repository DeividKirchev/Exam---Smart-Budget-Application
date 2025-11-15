/**
 * TransactionForm Component Tests
 *
 * Comprehensive test suite for the TransactionForm component covering:
 * - Rendering in create and edit modes
 * - Form validation
 * - User interactions
 * - Category filtering
 * - Form submission
 * - Error handling
 *
 * @module components/transactions/TransactionForm.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm from './TransactionForm';
import type { Transaction } from '../../models/Transaction';
import * as AppContext from '../../context/AppContext';
import * as categories from '../../constants/categories';

// Mock the AppContext
vi.mock('../../context/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// Mock the categories module
vi.mock('../../constants/categories', async () => {
  const actual = await vi.importActual<typeof categories>(
    '../../constants/categories'
  );
  return {
    ...actual,
    getCategoriesByType: vi.fn((type: 'income' | 'expense') => {
      if (type === 'income') {
        return [
          {
            id: 'salary',
            name: 'Salary',
            type: 'income',
            color: '#10B981',
            icon: 'Wallet',
          },
          {
            id: 'freelance',
            name: 'Freelance',
            type: 'income',
            color: '#059669',
            icon: 'Briefcase',
          },
        ];
      }
      return [
        {
          id: 'rent',
          name: 'Rent/Mortgage',
          type: 'expense',
          color: '#EF4444',
          icon: 'Home',
        },
        {
          id: 'food',
          name: 'Food/Groceries',
          type: 'expense',
          color: '#B91C1C',
          icon: 'ShoppingCart',
        },
      ];
    }),
  };
});

describe('TransactionForm', () => {
  const mockAddTransaction = vi.fn();
  const mockUpdateTransaction = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockTransaction: Transaction = {
    id: 'test-id-123',
    amount: 100.5,
    type: 'expense',
    category: 'food',
    date: '2025-11-15',
    description: 'Test transaction',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AppContext.useAppContext).mockReturnValue({
      transactions: [],
      categories: [],
      selectedPeriod: {
        type: 'this-month',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        label: 'This Month',
      },
      loading: false,
      error: null,
      filters: {
        dateRange: { preset: 'all', start: null, end: null },
        categories: [],
        type: 'all',
        searchText: '',
      },
      addTransaction: mockAddTransaction,
      updateTransaction: mockUpdateTransaction,
      deleteTransaction: vi.fn(),
      setPeriod: vi.fn(),
      clearError: vi.fn(),
      refreshData: vi.fn(),
      setFilters: vi.fn(),
      clearFilters: vi.fn(),
    });
  });

  describe('Rendering - Create Mode', () => {
    it('should render form in create mode with default values', () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Check form fields are present
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: /income/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: /expense/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

      // Check default values
      expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
      expect(screen.getByRole('radio', { name: /expense/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /income/i })).not.toBeChecked();

      // Check buttons
      expect(
        screen.getByRole('button', { name: /add transaction/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('should autofocus the amount field on mount', () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      expect(amountInput).toHaveFocus();
    });

    it('should default date to today', () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const today = new Date().toISOString().split('T')[0];
      const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
      expect(dateInput.value).toBe(today);
    });
  });

  describe('Rendering - Edit Mode', () => {
    it('should render form in edit mode with pre-populated data', () => {
      render(
        <TransactionForm
          mode="edit"
          transaction={mockTransaction}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Check pre-populated values
      expect(screen.getByLabelText(/amount/i)).toHaveValue(100.5);
      expect(screen.getByRole('radio', { name: /expense/i })).toBeChecked();
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue(
        'food'
      );
      expect(screen.getByLabelText(/date/i)).toHaveValue('2025-11-15');
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        'Test transaction'
      );

      // Check button label changed
      expect(
        screen.getByRole('button', { name: /update transaction/i })
      ).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should filter categories to income when type is income', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Switch to income
      await user.click(screen.getByRole('radio', { name: /income/i }));

      // Check category dropdown has income categories
      const categorySelect = screen.getByRole('combobox', {
        name: /category/i,
      });
      const options = Array.from(categorySelect.querySelectorAll('option')).map(
        opt => opt.textContent
      );

      expect(options).toContain('Salary');
      expect(options).toContain('Freelance');
      expect(options).not.toContain('Rent/Mortgage');
    });

    it('should filter categories to expense when type is expense', async () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Default is expense
      const categorySelect = screen.getByRole('combobox', {
        name: /category/i,
      });
      const options = Array.from(categorySelect.querySelectorAll('option')).map(
        opt => opt.textContent
      );

      expect(options).toContain('Rent/Mortgage');
      expect(options).toContain('Food/Groceries');
      expect(options).not.toContain('Salary');
    });

    it('should reset category when type changes to incompatible value', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Select expense category
      const categorySelect = screen.getByRole('combobox', {
        name: /category/i,
      });
      await user.selectOptions(categorySelect, 'food');
      expect(categorySelect).toHaveValue('food');

      // Switch to income
      await user.click(screen.getByRole('radio', { name: /income/i }));

      // Category should be reset
      await waitFor(() => {
        expect(categorySelect).toHaveValue('');
      });
    });
  });

  describe('Validation', () => {
    it('should show error for negative amount', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '-10');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/amount must be greater than zero/i)
        ).toBeInTheDocument();
      });
    });

    it('should show error for amount with more than 2 decimal places', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '10.123');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/cannot have more than 2 decimal places/i)
        ).toBeInTheDocument();
      });
    });

    it('should accept valid amount with 2 decimals', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '10.50');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(screen.queryByText(/amount/i)).not.toHaveClass('text-red-600');
      });
    });

    it('should show error when category is not selected', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill amount and trigger submit
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/please select a category/i)
        ).toBeInTheDocument();
      });
    });

    it('should enforce 200 character limit on description', async () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const longText = 'a'.repeat(201);
      const descriptionInput = screen.getByLabelText(
        /description/i
      ) as HTMLTextAreaElement;

      // Use fireEvent for faster test execution
      fireEvent.change(descriptionInput, { target: { value: longText } });
      fireEvent.blur(descriptionInput);

      await waitFor(() => {
        expect(screen.getByText(/200 characters or less/i)).toBeInTheDocument();
      });
    });

    it('should show character counter for description', () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('0/200')).toBeInTheDocument();
    });
  });

  describe('Form Submission - Create Mode', () => {
    it('should call addTransaction on valid submit in create mode', async () => {
      const user = userEvent.setup();
      const createdTransaction: Transaction = {
        ...mockTransaction,
        id: 'new-id',
      };
      mockAddTransaction.mockResolvedValue(createdTransaction);

      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/amount/i), '100.50');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /category/i }),
        'food'
      );
      await user.type(
        screen.getByLabelText(/description/i),
        'Test description'
      );

      // Submit
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      await waitFor(() => {
        expect(mockAddTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 100.5,
            type: 'expense',
            category: 'food',
            description: 'Test description',
          })
        );
        expect(mockOnSave).toHaveBeenCalledWith(createdTransaction);
      });
    });

    it('should prevent submission when validation fails', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Submit without filling required fields
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      await waitFor(() => {
        expect(mockAddTransaction).not.toHaveBeenCalled();
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });

    it('should show loading spinner during submission', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockTransaction), 100)
          )
      );

      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /category/i }),
        'food'
      );

      // Submit
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      // Check loading state
      expect(screen.getByText(/saving/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
      });
    });

    it('should reset form after successful create', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockResolvedValue(mockTransaction);

      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill form
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '100');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /category/i }),
        'food'
      );

      // Submit
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      await waitFor(() => {
        expect(amountInput).toHaveValue(null);
      });
    });
  });

  describe('Form Submission - Edit Mode', () => {
    it('should call updateTransaction on valid submit in edit mode', async () => {
      const user = userEvent.setup();
      const updatedTransaction: Transaction = {
        ...mockTransaction,
        amount: 200,
      };
      mockUpdateTransaction.mockResolvedValue(updatedTransaction);

      render(
        <TransactionForm
          mode="edit"
          transaction={mockTransaction}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Modify amount
      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '200');

      // Submit
      await user.click(
        screen.getByRole('button', { name: /update transaction/i })
      );

      await waitFor(() => {
        expect(mockUpdateTransaction).toHaveBeenCalledWith(
          'test-id-123',
          expect.objectContaining({
            amount: 200,
          })
        );
        expect(mockOnSave).toHaveBeenCalledWith(updatedTransaction);
      });
    });

    it('should NOT reset form after successful edit', async () => {
      const user = userEvent.setup();
      mockUpdateTransaction.mockResolvedValue(mockTransaction);

      render(
        <TransactionForm
          mode="edit"
          transaction={mockTransaction}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Submit
      await user.click(
        screen.getByRole('button', { name: /update transaction/i })
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toHaveValue(100.5);
      });
    });
  });

  describe('Cancel Action', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      mockAddTransaction.mockRejectedValue(new Error('Network error'));

      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill and submit form
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /category/i }),
        'food'
      );
      await user.click(
        screen.getByRole('button', { name: /add transaction/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on form fields', () => {
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/amount/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
      expect(screen.getByLabelText(/category/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
      expect(screen.getByLabelText(/date/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
    });

    it('should mark fields as invalid when errors exist', async () => {
      const user = userEvent.setup();
      render(
        <TransactionForm
          mode="create"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Trigger validation error
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '-10');
      await user.tab();

      await waitFor(() => {
        expect(amountInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });
});
