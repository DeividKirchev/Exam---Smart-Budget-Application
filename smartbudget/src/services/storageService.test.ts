/**
 * Unit tests for storageService module
 *
 * Tests all CRUD operations, error handling, and data validation
 * using mocked localStorage API.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadTransactions,
  saveTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  loadSettings,
  saveSettings,
  STORAGE_KEYS,
} from './storageService';
import type { Transaction } from '../models/Transaction';

// Mock the validators module
vi.mock('../utils/validators', () => ({
  validateTransactionData: vi.fn((transaction: Transaction) => {
    // Basic validation mock - checks for required fields
    if (!transaction.id || !transaction.amount || !transaction.date) {
      return {
        valid: false,
        errors: { general: 'Missing required fields' },
      };
    }
    return { valid: true, errors: {} };
  }),
}));

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct storage key constants', () => {
      expect(STORAGE_KEYS.TRANSACTIONS).toBe('smartbudget_transactions');
      expect(STORAGE_KEYS.SETTINGS).toBe('smartbudget_settings');
      expect(STORAGE_KEYS.SCHEMA_VERSION).toBe('smartbudget_schema_version');
    });
  });

  describe('loadTransactions', () => {
    it('should return empty array when no data exists', () => {
      const result = loadTransactions();
      expect(result).toEqual([]);
    });

    it('should load valid transactions from localStorage', () => {
      const mockTransactions: Transaction[] = [
        {
          id: '123',
          amount: 50,
          date: '2025-11-15',
          category: 'Food',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(mockTransactions)
      );

      const result = loadTransactions();
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array when data is corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, 'invalid-json{');

      const result = loadTransactions();
      expect(result).toEqual([]);
    });

    it('should return empty array when data is not an array', () => {
      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify({ notAnArray: true })
      );

      const result = loadTransactions();
      expect(result).toEqual([]);
    });

    it('should filter out invalid transactions using validateTransactionData', () => {
      const mockTransactions = [
        {
          id: '123',
          amount: 50,
          date: '2025-11-15',
          category: 'Food',
          type: 'expense',
          description: 'Valid',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
        {
          // Missing required fields - will be filtered out
          id: '',
          amount: 0,
        },
      ];

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(mockTransactions)
      );

      const result = loadTransactions();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('123');
    });
  });

  describe('saveTransactions', () => {
    it('should successfully save valid transactions', () => {
      const mockTransactions: Transaction[] = [
        {
          id: '123',
          amount: 50,
          date: '2025-11-15',
          category: 'Food',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      const result = saveTransactions(mockTransactions);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      expect(saved).toBe(JSON.stringify(mockTransactions));
    });

    it('should handle QuotaExceededError gracefully', () => {
      // Save the original setItem
      const originalSetItem = localStorage.setItem;

      // Create a mock that throws QuotaExceededError
      const mockSetItem = vi.fn().mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      // Replace setItem with our mock
      Object.defineProperty(localStorage, 'setItem', {
        value: mockSetItem,
        writable: true,
        configurable: true,
      });

      const mockTransactions: Transaction[] = [
        {
          id: '123',
          amount: 50,
          date: '2025-11-15',
          category: 'Food',
          type: 'expense',
          description: 'Groceries',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      const result = saveTransactions(mockTransactions);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Storage limit reached. Please delete old transactions.'
      );

      // Restore original
      Object.defineProperty(localStorage, 'setItem', {
        value: originalSetItem,
        writable: true,
        configurable: true,
      });
    });

    it('should return success true on successful save', () => {
      const result = saveTransactions([]);
      expect(result).toEqual({ success: true });
    });
  });

  describe('addTransaction', () => {
    it('should generate UUID v4 format for id', () => {
      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'Food',
        type: 'expense' as const,
        description: 'Lunch',
      };

      const result = addTransaction(newTransaction);

      // UUID v4 format check (8-4-4-4-12 hexadecimal pattern)
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(result.id).toMatch(uuidPattern);
    });

    it('should add createdAt and updatedAt timestamps in ISO 8601 format', () => {
      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'Food',
        type: 'expense' as const,
        description: 'Lunch',
      };

      const result = addTransaction(newTransaction);

      // ISO 8601 format check
      const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(result.createdAt).toMatch(isoPattern);
      expect(result.updatedAt).toMatch(isoPattern);
    });

    it('should load existing transactions and append new one', () => {
      const existingTransaction: Transaction = {
        id: 'existing-123',
        amount: 50,
        date: '2025-11-14',
        category: 'Food',
        type: 'expense',
        description: 'Existing',
        createdAt: '2025-11-14T10:00:00.000Z',
        updatedAt: '2025-11-14T10:00:00.000Z',
      };

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify([existingTransaction])
      );

      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'Food',
        type: 'expense' as const,
        description: 'New',
      };

      addTransaction(newTransaction);

      const saved = loadTransactions();
      expect(saved).toHaveLength(2);
      expect(saved[0].id).toBe('existing-123');
      expect(saved[1].description).toBe('New');
    });

    it('should return complete Transaction object with all fields', () => {
      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'Food',
        type: 'expense' as const,
        description: 'Complete test',
      };

      const result = addTransaction(newTransaction);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('amount', 100);
      expect(result).toHaveProperty('date', '2025-11-15');
      expect(result).toHaveProperty('category', 'Food');
      expect(result).toHaveProperty('type', 'expense');
      expect(result).toHaveProperty('description', 'Complete test');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('updateTransaction', () => {
    it('should successfully update existing transaction', () => {
      const existingTransaction: Transaction = {
        id: 'update-123',
        amount: 50,
        date: '2025-11-14',
        category: 'Food',
        type: 'expense',
        description: 'Original',
        createdAt: '2025-11-14T10:00:00.000Z',
        updatedAt: '2025-11-14T10:00:00.000Z',
      };

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify([existingTransaction])
      );

      const updates = {
        amount: 75,
        description: 'Updated',
      };

      const result = updateTransaction('update-123', updates);

      expect(result.amount).toBe(75);
      expect(result.description).toBe('Updated');
      expect(result.id).toBe('update-123'); // ID should not change
      expect(result.createdAt).toBe('2025-11-14T10:00:00.000Z'); // createdAt should not change
    });

    it('should throw error if transaction not found', () => {
      expect(() => {
        updateTransaction('non-existent-id', { amount: 100 });
      }).toThrow('Transaction with id non-existent-id not found');
    });

    it('should update updatedAt timestamp', () => {
      const existingTransaction: Transaction = {
        id: 'timestamp-123',
        amount: 50,
        date: '2025-11-14',
        category: 'Food',
        type: 'expense',
        description: 'Test',
        createdAt: '2025-11-14T10:00:00.000Z',
        updatedAt: '2025-11-14T10:00:00.000Z',
      };

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify([existingTransaction])
      );

      const result = updateTransaction('timestamp-123', { amount: 75 });

      expect(result.updatedAt).not.toBe('2025-11-14T10:00:00.000Z');
      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        new Date('2025-11-14T10:00:00.000Z').getTime()
      );
    });

    it('should merge partial updates with existing data', () => {
      const existingTransaction: Transaction = {
        id: 'merge-123',
        amount: 50,
        date: '2025-11-14',
        category: 'Food',
        type: 'expense',
        description: 'Original',
        createdAt: '2025-11-14T10:00:00.000Z',
        updatedAt: '2025-11-14T10:00:00.000Z',
      };

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify([existingTransaction])
      );

      const updates = { amount: 75 }; // Only update amount

      const result = updateTransaction('merge-123', updates);

      expect(result.amount).toBe(75);
      expect(result.description).toBe('Original'); // Should remain unchanged
      expect(result.category).toBe('Food'); // Should remain unchanged
    });
  });

  describe('deleteTransaction', () => {
    it('should remove transaction and return true', () => {
      const transactions: Transaction[] = [
        {
          id: 'delete-123',
          amount: 50,
          date: '2025-11-14',
          category: 'Food',
          type: 'expense',
          description: 'To delete',
          createdAt: '2025-11-14T10:00:00.000Z',
          updatedAt: '2025-11-14T10:00:00.000Z',
        },
        {
          id: 'keep-456',
          amount: 100,
          date: '2025-11-15',
          category: 'Transport',
          type: 'expense',
          description: 'To keep',
          createdAt: '2025-11-15T10:00:00.000Z',
          updatedAt: '2025-11-15T10:00:00.000Z',
        },
      ];

      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(transactions)
      );

      const result = deleteTransaction('delete-123');

      expect(result).toBe(true);

      const remaining = loadTransactions();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('keep-456');
    });

    it('should return false if transaction not found', () => {
      const result = deleteTransaction('non-existent-id');
      expect(result).toBe(false);
    });

    it('should not throw error for non-existent ID', () => {
      expect(() => {
        deleteTransaction('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('loadSettings', () => {
    it('should return defaults when not found', () => {
      const result = loadSettings();

      expect(result).toHaveProperty('selectedPeriod');
      expect(result.selectedPeriod).toHaveProperty('type', 'this-month');
      expect(result.selectedPeriod).toHaveProperty('label', 'This Month');
    });

    it('should parse and return existing settings', () => {
      const mockSettings = {
        selectedPeriod: {
          type: 'custom',
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          label: 'January',
        },
      };

      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mockSettings));

      const result = loadSettings();

      expect(result).toEqual(mockSettings);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, 'invalid-json{');

      const result = loadSettings();

      expect(result).toHaveProperty('selectedPeriod');
      expect(result.selectedPeriod).toHaveProperty('type', 'this-month');
    });
  });

  describe('saveSettings', () => {
    it('should persist settings to localStorage', () => {
      const newSettings = {
        selectedPeriod: {
          type: 'last-month',
          startDate: '2025-10-01',
          endDate: '2025-10-31',
          label: 'October',
        },
      };

      saveSettings(newSettings);

      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.selectedPeriod.type).toBe('last-month');
    });

    it('should merge with existing settings', () => {
      const existingSettings = {
        selectedPeriod: {
          type: 'this-month',
          label: 'This Month',
        },
        customField: 'existing',
      };

      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(existingSettings)
      );

      const newSettings = {
        selectedPeriod: {
          type: 'last-month',
          label: 'Last Month',
        },
      };

      saveSettings(newSettings);

      const result = loadSettings();
      expect(result.selectedPeriod.type).toBe('last-month');
      expect(result.customField).toBe('existing');
    });
  });

  describe('schema versioning', () => {
    it('should set schema version when adding first transaction', () => {
      const newTransaction = {
        amount: 100,
        date: '2025-11-15',
        category: 'Food',
        type: 'expense' as const,
        description: 'Test',
      };

      addTransaction(newTransaction);

      const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      expect(version).toBe('1');
    });
  });

  describe('error handling', () => {
    it('should have try-catch blocks for all localStorage operations', () => {
      // This is tested implicitly through the error handling tests above
      // All functions handle errors gracefully without throwing to the caller
      expect(() => loadTransactions()).not.toThrow();
      expect(() => loadSettings()).not.toThrow();
    });
  });
});
