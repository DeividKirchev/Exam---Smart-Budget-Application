/**
 * FilterCriteria Model
 *
 * Defines the structure for transaction filtering criteria.
 * Supports filtering by date range, categories, type, and search text.
 *
 * @module models/FilterCriteria
 */

/**
 * Filter criteria interface for transactions
 */
export interface FilterCriteria {
  /** Date range filter configuration */
  dateRange: {
    /** Preset filter option */
    preset: 'all' | 'thisMonth' | 'lastMonth' | 'custom';
    /** Start date in ISO format (YYYY-MM-DD) or null */
    start: string | null;
    /** End date in ISO format (YYYY-MM-DD) or null */
    end: string | null;
  };

  /** Array of category IDs to filter by (empty = all categories) */
  categories: string[];

  /** Transaction type filter */
  type: 'all' | 'income' | 'expense';

  /** Search text for description filtering (case-insensitive) */
  searchText: string;
}

/**
 * Default filter state (no filtering applied)
 */
export const DEFAULT_FILTERS: FilterCriteria = {
  dateRange: {
    preset: 'all',
    start: null,
    end: null,
  },
  categories: [],
  type: 'all',
  searchText: '',
};

/**
 * Checks if filters are in default state (no active filters)
 */
export const isFiltersDefault = (filters: FilterCriteria): boolean => {
  return (
    filters.dateRange.preset === 'all' &&
    filters.categories.length === 0 &&
    filters.type === 'all' &&
    filters.searchText === ''
  );
};
