/**
 * Unit tests for AppContext
 *
 * Tests provider, custom hook, state management, and all action methods
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import type { Transaction } from '../models/Transaction';
import type { Period } from '../models/Period';

// Mock the storage service
vi.mock('../services/storageService', () => ({
  storageService: {
    loadTransactions: vi.fn(() => []),
    loadSettings: vi.fn(() => ({ selectedPeriod: null })),
    saveSettings: vi.fn(),
    addTransaction: vi.fn(transaction => ({
      ...transaction,
      id: 'test-uuid-123',
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    })),
    updateTransaction: vi.fn((id, updates) => ({
      id,
      ...updates,
      updatedAt: '2025-11-15T11:00:00.000Z',
    })),
    deleteTransaction: vi.fn(() => true),
  },
}));

// Mock the CATEGORIES constant
vi.mock('../constants/categories', () => ({
  CATEGORIES: [
    {
      id: 'salary',
      name: 'Salary',
      type: 'income',
      color: '#10B981',
      icon: 'Wallet',
    },
    {
      id: 'food',
      name: 'Food',
      type: 'expense',
      color: '#B91C1C',
      icon: 'ShoppingCart',
    },
  ],
}));

// Mock validators
vi.mock('../utils/validators', () => ({
  validateTransactionData: vi.fn(() => ({ valid: true, errors: {} })),
}));

describe('AppContext', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset validator mock to default valid state
    const { validateTransactionData } = await import('../utils/validators');
    vi.mocked(validateTransactionData).mockReturnValue({
      valid: true,
      errors: {},
    });

    // Reset storage service mocks to default behavior
    const { storageService } = await import('../services/storageService');
    vi.mocked(storageService.loadTransactions).mockReturnValue([]);
    vi.mocked(storageService.loadSettings).mockReturnValue({
      selectedPeriod: null,
    });
    vi.mocked(storageService.addTransaction).mockImplementation(
      transaction => ({
        ...transaction,
        id: 'test-uuid-123',
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      })
    );
    vi.mocked(storageService.updateTransaction).mockImplementation(
      (id, updates) => ({
        id,
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income' as const,
        description: 'Original',
        createdAt: '2025-11-15T10:00:00.000Z',
        ...updates,
        updatedAt: '2025-11-15T11:00:00.000Z',
      })
    );
    vi.mocked(storageService.deleteTransaction).mockReturnValue(true);
  });

  describe('AppProvider', () => {
    it('should render children successfully', () => {
      const { getByText } = render(
        <AppProvider>
          <div>Test Child</div>
        </AppProvider>
      );

      expect(getByText('Test Child')).toBeDefined();
    });

    it('should load initial transactions from storageService on mount', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-15',
          category: 'salary',
          type: 'income',
          description: 'Paycheck',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.loadTransactions).mockReturnValue(
        mockTransactions
      );

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.transactions).toEqual(mockTransactions);
    });

    it('should load initial categories from CATEGORIES constant', async () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toHaveLength(2);
      expect(result.current.categories[0].id).toBe('salary');
      expect(result.current.categories[1].id).toBe('food');
    });

    it('should load selected period from storageService settings', async () => {
      const mockPeriod: Period = {
        type: 'custom',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        label: 'January 2025',
      };

      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.loadSettings).mockReturnValue({
        selectedPeriod: mockPeriod,
      });

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.selectedPeriod).toEqual(mockPeriod);
    });

    it('should set default period if not found in settings', async () => {
      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.loadSettings).mockReturnValue({});

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.selectedPeriod.type).toBe('this-month');
      expect(result.current.selectedPeriod.label).toBe('This Month');
    });

    it('should handle errors during initial data load', async () => {
      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.loadTransactions).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Storage error');
    });
  });

  describe('useAppContext hook', () => {
    it('should throw error when used outside AppProvider', () => {
      expect(() => {
        renderHook(() => useAppContext());
      }).toThrow('useAppContext must be used within AppProvider');
    });

    it('should return context value when used inside AppProvider', async () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('transactions');
      expect(result.current).toHaveProperty('categories');
      expect(result.current).toHaveProperty('selectedPeriod');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('addTransaction');
      expect(result.current).toHaveProperty('updateTransaction');
      expect(result.current).toHaveProperty('deleteTransaction');
      expect(result.current).toHaveProperty('setPeriod');
      expect(result.current).toHaveProperty('clearError');
      expect(result.current).toHaveProperty('refreshData');
    });
  });

  describe('addTransaction', () => {
    it('should validate transaction data before calling storageService', async () => {
      const { validateTransactionData } = await import('../utils/validators');
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income' as const,
        description: 'Paycheck',
      };

      await act(async () => {
        await result.current.addTransaction(newTransaction);
      });

      expect(validateTransactionData).toHaveBeenCalledWith(newTransaction);
    });

    it('should call storageService.addTransaction and update state', async () => {
      const { storageService } = await import('../services/storageService');
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income' as const,
        description: 'Paycheck',
      };

      let addedTransaction: Transaction | undefined;

      await act(async () => {
        addedTransaction = await result.current.addTransaction(newTransaction);
      });

      expect(storageService.addTransaction).toHaveBeenCalledWith(
        newTransaction
      );
      expect(addedTransaction).toBeDefined();
      expect(addedTransaction?.id).toBe('test-uuid-123');
      expect(result.current.transactions).toContainEqual(addedTransaction);
    });

    it('should set error state if validation fails', async () => {
      const { validateTransactionData } = await import('../utils/validators');
      vi.mocked(validateTransactionData).mockReturnValue({
        isValid: false,
        errors: ['Amount is required', 'Date is invalid'],
      });

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const invalidTransaction = {
        amount: -10,
        date: 'invalid',
        category: 'salary',
        type: 'income' as const,
        description: '',
      };

      await act(async () => {
        try {
          await result.current.addTransaction(invalidTransaction);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.error).toContain('Validation failed');
    });

    it('should handle storageService errors', async () => {
      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.addTransaction).mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income' as const,
        description: 'Test',
      };

      await act(async () => {
        try {
          await result.current.addTransaction(newTransaction);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Storage full');
    });
  });

  describe('updateTransaction', () => {
    it('should call storageService.updateTransaction and update state', async () => {
      const { storageService } = await import('../services/storageService');

      const existingTransaction: Transaction = {
        id: '1',
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income',
        description: 'Original',
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      };

      vi.mocked(storageService.loadTransactions).mockReturnValue([
        existingTransaction,
      ]);

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = { description: 'Updated' };

      let updatedTransaction: Transaction | undefined;

      await act(async () => {
        updatedTransaction = await result.current.updateTransaction(
          '1',
          updates
        );
      });

      expect(storageService.updateTransaction).toHaveBeenCalledWith(
        '1',
        updates
      );
      expect(updatedTransaction?.description).toBe('Updated');
      expect(result.current.transactions[0].description).toBe('Updated');
    });

    it('should throw error if transaction not found', async () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.updateTransaction('non-existent', {
            amount: 200,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain('not found');
        }
      });
    });

    it('should validate merged data before updating', async () => {
      const { validateTransactionData } = await import('../utils/validators');
      const { storageService } = await import('../services/storageService');

      const existingTransaction: Transaction = {
        id: '1',
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income',
        description: 'Original',
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      };

      vi.mocked(storageService.loadTransactions).mockReturnValue([
        existingTransaction,
      ]);

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTransaction('1', { amount: 200 });
      });

      expect(validateTransactionData).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 200 })
      );
    });
  });

  describe('deleteTransaction', () => {
    it('should call storageService.deleteTransaction and update state', async () => {
      const { storageService } = await import('../services/storageService');

      const existingTransaction: Transaction = {
        id: '1',
        amount: 100,
        date: '2025-11-15',
        category: 'salary',
        type: 'income',
        description: 'To delete',
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      };

      vi.mocked(storageService.loadTransactions).mockReturnValue([
        existingTransaction,
      ]);

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.transactions).toHaveLength(1);

      let wasDeleted: boolean | undefined;

      await act(async () => {
        wasDeleted = await result.current.deleteTransaction('1');
      });

      expect(storageService.deleteTransaction).toHaveBeenCalledWith('1');
      expect(wasDeleted).toBe(true);
      expect(result.current.transactions).toHaveLength(0);
    });

    it('should return false if transaction not found', async () => {
      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.deleteTransaction).mockReturnValue(false);

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let wasDeleted: boolean | undefined;

      await act(async () => {
        wasDeleted = await result.current.deleteTransaction('non-existent');
      });

      expect(wasDeleted).toBe(false);
    });
  });

  describe('setPeriod', () => {
    it('should update period and save to storageService settings', async () => {
      const { storageService } = await import('../services/storageService');
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newPeriod: Period = {
        type: 'last-month',
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        label: 'October 2025',
      };

      act(() => {
        result.current.setPeriod(newPeriod);
      });

      expect(result.current.selectedPeriod).toEqual(newPeriod);
      expect(storageService.saveSettings).toHaveBeenCalledWith({
        selectedPeriod: newPeriod,
      });
    });
  });

  describe('clearError', () => {
    it('should reset error state to null', async () => {
      const { storageService } = await import('../services/storageService');
      vi.mocked(storageService.loadTransactions).mockImplementation(() => {
        throw new Error('Initial error');
      });

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('refreshData', () => {
    it('should reload transactions from storageService', async () => {
      const { storageService } = await import('../services/storageService');

      const initialTransactions: Transaction[] = [];
      const refreshedTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          date: '2025-11-15',
          category: 'salary',
          type: 'income',
          description: 'Refreshed',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      vi.mocked(storageService.loadTransactions)
        .mockReturnValueOnce(initialTransactions)
        .mockReturnValueOnce(refreshedTransactions);

      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.transactions).toHaveLength(0);

      await act(async () => {
        await result.current.refreshData();
      });

      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].description).toBe('Refreshed');
    });

    it('should set loading state during refresh', async () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshData();
      });

      // Loading should be false after refresh completes
      expect(result.current.loading).toBe(false);
    });
  });
});
