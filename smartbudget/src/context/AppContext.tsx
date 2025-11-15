/**
 * AppContext Module
 *
 * Provides centralized state management for the SmartBudget application using
 * React Context API and useReducer. Manages transactions, categories, selected
 * period, and error states without prop drilling.
 *
 * @module context/AppContext
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction } from '../models/Transaction';
import type { Category } from '../models/Category';
import type { Period } from '../models/Period';
import type { FilterCriteria } from '../models/FilterCriteria';
import { storageService } from '../services/storageService';
import { CATEGORIES } from '../constants/categories';
import { validateTransactionData } from '../utils/validators';
import { DEFAULT_FILTERS } from '../models/FilterCriteria';

/**
 * Application context value interface
 * Defines all state properties and action methods available to consuming components
 */
export interface AppContextValue {
  /** Array of all transactions loaded from storage */
  transactions: Transaction[];

  /** Array of predefined categories (imported from constants) */
  categories: Category[];

  /** Currently selected time period for filtering transactions */
  selectedPeriod: Period;

  /** Loading state for async operations */
  loading: boolean;

  /** Error message for user feedback (null when no error) */
  error: string | null;

  /** Current filter criteria for transactions */
  filters: FilterCriteria;

  /**
   * Adds a new transaction
   * @param transaction - Transaction data without id and timestamps
   * @returns Promise resolving to the created transaction with id and timestamps
   */
  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Transaction>;

  /**
   * Updates an existing transaction
   * @param id - Transaction ID to update
   * @param updates - Partial transaction data to merge
   * @returns Promise resolving to the updated transaction
   */
  updateTransaction: (
    id: string,
    updates: Partial<Transaction>
  ) => Promise<Transaction>;

  /**
   * Deletes a transaction by ID
   * @param id - Transaction ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteTransaction: (id: string) => Promise<boolean>;

  /**
   * Updates the selected time period
   * @param period - New period to set
   */
  setPeriod: (period: Period) => void;

  /**
   * Clears the current error state
   */
  clearError: () => void;

  /**
   * Reloads transactions from localStorage
   * @returns Promise that resolves when data is refreshed
   */
  refreshData: () => Promise<void>;

  /**
   * Updates the filter criteria
   * @param filters - New filter criteria to apply
   */
  setFilters: (filters: FilterCriteria) => void;

  /**
   * Resets filters to default state
   */
  clearFilters: () => void;
}

/**
 * Internal state interface for the reducer
 */
interface State {
  transactions: Transaction[];
  categories: Category[];
  selectedPeriod: Period;
  loading: boolean;
  error: string | null;
  filters: FilterCriteria;
}

/**
 * Action types for the reducer
 */
type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_PERIOD'; payload: Period }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_FILTERS'; payload: FilterCriteria }
  | { type: 'CLEAR_FILTERS' };

/**
 * Default period for initial state
 */
const getDefaultPeriod = (): Period => ({
  type: 'this-month',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0],
  endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    .toISOString()
    .split('T')[0],
  label: 'This Month',
});

/**
 * Reducer function for state management
 * Pure function with no side effects
 */
function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'SET_PERIOD':
      return { ...state, selectedPeriod: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_FILTERS':
      // Persist filters to localStorage
      try {
        localStorage.setItem(
          'smartbudget_filters',
          JSON.stringify(action.payload)
        );
      } catch (error) {
        console.error('Failed to persist filters:', error);
      }
      return { ...state, filters: action.payload };

    case 'CLEAR_FILTERS':
      // Clear filters from localStorage
      try {
        localStorage.removeItem('smartbudget_filters');
      } catch (error) {
        console.error('Failed to clear filters:', error);
      }
      return { ...state, filters: DEFAULT_FILTERS };

    default:
      return state;
  }
}

/**
 * Create the context with undefined as default value
 * This enforces usage of the useAppContext hook
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * AppProvider component props
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider component
 * Wraps the application to provide centralized state management
 *
 * @example
 * ```tsx
 * import { AppProvider } from './context/AppContext';
 *
 * function App() {
 *   return (
 *     <AppProvider>
 *       <YourApp />
 *     </AppProvider>
 *   );
 * }
 * ```
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Load saved filters from localStorage
  const loadSavedFilters = (): FilterCriteria => {
    try {
      const saved = localStorage.getItem('smartbudget_filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate structure
        if (parsed && typeof parsed === 'object' && 'dateRange' in parsed) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
    return DEFAULT_FILTERS;
  };

  // Initialize state with useReducer
  const [state, dispatch] = useReducer(appReducer, {
    transactions: [],
    categories: CATEGORIES as Category[],
    selectedPeriod: getDefaultPeriod(),
    loading: true,
    error: null,
    filters: loadSavedFilters(),
  });

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Load transactions from storage
        const transactions = storageService.loadTransactions();
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });

        // Load settings (selected period)
        const settings = storageService.loadSettings();
        if (settings.selectedPeriod) {
          dispatch({ type: 'SET_PERIOD', payload: settings.selectedPeriod });
        }

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to load initial data';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  /**
   * Adds a new transaction
   * Validates data before calling storage service
   */
  const addTransaction = async (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> => {
    try {
      // Validate transaction data
      const validation = validateTransactionData(transaction as Transaction);
      if (!validation.valid) {
        const errorMsg = `Validation failed: ${Object.values(validation.errors).join(', ')}`;
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        throw new Error(errorMsg);
      }

      // Call storage service
      const newTransaction = storageService.addTransaction(transaction);

      // Update state
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });

      return newTransaction;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add transaction';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Updates an existing transaction
   * Validates merged data before calling storage service
   */
  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> => {
    try {
      // Find existing transaction to merge with updates
      const existing = state.transactions.find(t => t.id === id);
      if (!existing) {
        throw new Error(`Transaction with id ${id} not found`);
      }

      // Merge updates with existing data for validation
      const merged = { ...existing, ...updates };
      const validation = validateTransactionData(merged);
      if (!validation.valid) {
        const errorMsg = `Validation failed: ${Object.values(validation.errors).join(', ')}`;
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        throw new Error(errorMsg);
      }

      // Call storage service
      const updatedTransaction = storageService.updateTransaction(id, updates);

      // Update state
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });

      return updatedTransaction;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update transaction';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Deletes a transaction by ID
   */
  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      // Call storage service
      const wasDeleted = storageService.deleteTransaction(id);

      // Update state if deleted
      if (wasDeleted) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      }

      return wasDeleted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete transaction';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Updates the selected period
   * Persists to localStorage via storageService
   */
  const setPeriod = (period: Period): void => {
    dispatch({ type: 'SET_PERIOD', payload: period });
    storageService.saveSettings({ selectedPeriod: period });
  };

  /**
   * Clears the current error state
   */
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Reloads transactions from localStorage
   * Useful for manual data refresh or recovery scenarios
   */
  const refreshData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const transactions = storageService.loadTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refresh data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  /**
   * Updates the filter criteria
   */
  const setFilters = (filters: FilterCriteria): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  /**
   * Resets filters to default state
   */
  const clearFilters = (): void => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Create context value object
  const value: AppContextValue = {
    transactions: state.transactions,
    categories: state.categories,
    selectedPeriod: state.selectedPeriod,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setPeriod,
    clearError,
    refreshData,
    setFilters,
    clearFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to access the AppContext
 * Throws error if used outside of AppProvider
 *
 * @returns AppContextValue object with state and actions
 * @throws Error if used outside AppProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { transactions, addTransaction } = useAppContext();
 *
 *   const handleAdd = async () => {
 *     await addTransaction({ amount: 100, date: '2025-11-15', ... });
 *   };
 *
 *   return <div>{transactions.length} transactions</div>;
 * }
 * ```
 */
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
