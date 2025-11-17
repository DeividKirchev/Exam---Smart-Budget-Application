/**
 * StorageService Module
 *
 * Handles all LocalStorage operations for SmartBudget application.
 * Provides CRUD operations for transactions and settings with comprehensive
 * error handling, data validation, and graceful fallbacks.
 *
 * @module storageService
 */

import { v4 as uuidv4 } from 'uuid';
import type { Transaction } from '../models/Transaction';
import type { Period } from '../models/Period';
import { validateTransactionData } from '../utils/validators';

/**
 * LocalStorage key constants for data persistence
 */
export const STORAGE_KEYS = {
  TRANSACTIONS: 'smartbudget_transactions',
  SETTINGS: 'smartbudget_settings',
  SCHEMA_VERSION: 'smartbudget_schema_version',
} as const;

/**
 * Result object returned by save operations
 */
export interface SaveResult {
  success: boolean;
  error?: string;
}

/**
 * Settings object structure
 */
export interface Settings {
  selectedPeriod?: Period;
  [key: string]: unknown;
}

/**
 * Retrieves all transactions from localStorage.
 *
 * Validates each transaction using validateTransactionData() and filters out
 * invalid/corrupted entries. Never throws errors to calling code.
 *
 * @returns {Transaction[]} Array of valid transactions (empty array if no data or all corrupted)
 */
export function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      console.warn(
        'StorageService: Transaction data is not an array, returning empty array'
      );
      return [];
    }

    // Validate each transaction and filter out invalid ones
    const validTransactions = parsed.filter(transaction => {
      const validation = validateTransactionData(transaction);

      if (!validation.valid) {
        console.warn(
          `StorageService: Invalid transaction filtered out:`,
          validation.errors
        );
        return false;
      }

      return true;
    });

    return validTransactions;
  } catch (error) {
    console.warn(
      'StorageService: Error loading transactions, returning empty array:',
      error
    );
    return [];
  }
}

/**
 * Persists transaction array to localStorage.
 *
 * Handles QuotaExceededError gracefully and returns user-friendly error messages.
 *
 * @param {Transaction[]} transactions - Array of transactions to save
 * @returns {SaveResult} Object with success status and optional error message
 */
export function saveTransactions(transactions: Transaction[]): SaveResult {
  try {
    const data = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, data);
    return { success: true };
  } catch (error) {
    // Check for QuotaExceededError (can be DOMException or Error with specific name)
    if (
      (error instanceof DOMException && error.name === 'QuotaExceededError') ||
      (error instanceof Error && error.name === 'QuotaExceededError')
    ) {
      return {
        success: false,
        error: 'Storage limit reached. Please delete old transactions.',
      };
    }

    console.error('StorageService: Error saving transactions:', error);
    return {
      success: false,
      error: 'Failed to save transactions.',
    };
  }
}

/**
 * Creates a new transaction with auto-generated UUID and timestamps.
 *
 * Loads current transactions, appends the new one, and saves to storage.
 *
 * @param {Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>} transaction - Transaction data without id and timestamps
 * @returns {Transaction} Complete transaction object with all fields populated
 */
export function addTransaction(
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Transaction {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  const transactions = loadTransactions();
  transactions.push(newTransaction);

  const result = saveTransactions(transactions);

  if (!result.success) {
    throw new Error(result.error || 'Failed to save transaction');
  }

  // Initialize schema version if not set
  if (!getSchemaVersion()) {
    setSchemaVersion(1);
  }

  return newTransaction;
}

/**
 * Updates an existing transaction by ID.
 *
 * Merges updates with existing transaction data and updates the updatedAt timestamp.
 *
 * @param {string} id - Transaction ID to update
 * @param {Partial<Transaction>} updates - Partial transaction data to merge
 * @returns {Transaction} Updated transaction object
 * @throws {Error} If transaction with given ID is not found
 */
export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction {
  const transactions = loadTransactions();
  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error(`Transaction with id ${id} not found`);
  }

  const updated: Transaction = {
    ...transactions[index],
    ...updates,
    id: transactions[index].id, // Ensure ID cannot be changed
    createdAt: transactions[index].createdAt, // Ensure createdAt cannot be changed
    updatedAt: new Date().toISOString(),
  };

  transactions[index] = updated;

  const result = saveTransactions(transactions);

  if (!result.success) {
    throw new Error(result.error || 'Failed to save updated transaction');
  }

  return updated;
}

/**
 * Removes a transaction by ID.
 *
 * Does not throw error if transaction doesn't exist.
 *
 * @param {string} id - Transaction ID to delete
 * @returns {boolean} True if transaction was found and deleted, false if not found
 */
export function deleteTransaction(id: string): boolean {
  const transactions = loadTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  const wasDeleted = filtered.length < transactions.length;

  if (wasDeleted) {
    const result = saveTransactions(filtered);

    if (!result.success) {
      throw new Error(result.error || 'Failed to save after deletion');
    }
  }

  return wasDeleted;
}

/**
 * Default settings object
 */
const DEFAULT_SETTINGS: Settings = {
  selectedPeriod: {
    type: 'this-month' as const,
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toISOString(),
    label: 'This Month',
  },
};

/**
 * Retrieves user settings from localStorage.
 *
 * Returns default settings if not found or corrupted.
 *
 * @returns {Settings} Settings object with defaults if not found
 */
export function loadSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (!data) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {
    console.warn(
      'StorageService: Error loading settings, returning defaults:',
      error
    );
    return DEFAULT_SETTINGS;
  }
}

/**
 * Merges and persists settings to localStorage.
 *
 * Handles JSON parse/stringify errors gracefully.
 *
 * @param {Settings} settings - Settings object to save
 */
export function saveSettings(settings: Settings): void {
  try {
    const currentSettings = loadSettings();
    const merged = { ...currentSettings, ...settings };
    const data = JSON.stringify(merged);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, data);
  } catch (error) {
    console.error('StorageService: Error saving settings:', error);
  }
}

/**
 * Retrieves schema version from localStorage.
 *
 * Defaults to version 1 if not found. This enables future data migrations.
 *
 * @returns {number} Schema version number
 */
function getSchemaVersion(): number {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.warn('StorageService: Error loading schema version:', error);
    return 0;
  }
}

/**
 * Sets schema version in localStorage.
 *
 * Used for future data migrations.
 *
 * @param {number} version - Schema version number to set
 */
function setSchemaVersion(version: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, version.toString());
  } catch (error) {
    console.error('StorageService: Error setting schema version:', error);
  }
}

/**
 * Storage service object with all CRUD methods
 */
export const storageService = {
  loadTransactions,
  saveTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  loadSettings,
  saveSettings,
};
