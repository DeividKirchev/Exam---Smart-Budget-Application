/**
 * Transaction Filtering Utility
 *
 * Client-side filtering logic for transactions based on FilterCriteria.
 * Uses AND combination - all active filters must match for a transaction to be included.
 *
 * @module utils/filterTransactions
 */

import { parseISO, isWithinInterval } from 'date-fns';
import type { Transaction } from '../models/Transaction';
import type { FilterCriteria } from '../models/FilterCriteria';

/**
 * Filters transactions based on provided criteria
 *
 * Applies the following filters with AND logic:
 * - Date range (if start/end dates provided)
 * - Categories (if any selected)
 * - Type (income/expense if not 'all')
 * - Search text (case-insensitive substring match on description)
 *
 * @param transactions - Array of transactions to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered array of transactions
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: FilterCriteria
): Transaction[] {
  return transactions.filter(transaction => {
    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      try {
        const transactionDate = parseISO(transaction.date);
        const startDate = parseISO(filters.dateRange.start);
        const endDate = parseISO(filters.dateRange.end);

        const inRange = isWithinInterval(transactionDate, {
          start: startDate,
          end: endDate,
        });

        if (!inRange) return false;
      } catch (error) {
        // If date parsing fails, exclude this transaction
        console.error('Date parsing error:', error);
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(transaction.category)) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'all') {
      if (transaction.type !== filters.type) {
        return false;
      }
    }

    // Search filter (case-insensitive substring match)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const descriptionLower = transaction.description.toLowerCase();

      if (!descriptionLower.includes(searchLower)) {
        return false;
      }
    }

    // All filters passed
    return true;
  });
}
