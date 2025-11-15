/**
 * FilterPanel Component
 *
 * Provides comprehensive filtering controls for transactions including:
 * - Date range filter (presets and custom range)
 * - Category multi-select filter
 * - Type filter (all/income/expense)
 * - Search by description
 * - Clear all filters button
 * - Active filter indicators
 *
 * @module components/transactions/FilterPanel
 */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  getCategoriesByType,
  getCategoryById,
} from '../../constants/categories';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { isFiltersDefault } from '../../models/FilterCriteria';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * FilterPanel Component
 *
 * Displays all filtering controls above the transactions list.
 * Responsive: stacked on mobile, horizontal on desktop.
 */
export const FilterPanel: React.FC = () => {
  const { filters, setFilters, clearFilters, categories } = useAppContext();

  // Local state for search input (debounced before updating global filters)
  const [searchInput, setSearchInput] = useState(filters.searchText);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Local state for category dropdown visibility
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Update global filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.searchText) {
      setFilters({ ...filters, searchText: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  /**
   * Handles date range preset selection
   */
  const handleDateRangePreset = (
    preset: 'all' | 'thisMonth' | 'lastMonth' | 'custom'
  ) => {
    let start: string | null = null;
    let end: string | null = null;

    if (preset === 'thisMonth') {
      start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      end = format(new Date(), 'yyyy-MM-dd');
    } else if (preset === 'lastMonth') {
      const lastMonth = subMonths(new Date(), 1);
      start = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
      end = format(endOfMonth(lastMonth), 'yyyy-MM-dd');
    }

    setFilters({
      ...filters,
      dateRange: { preset, start, end },
    });
  };

  /**
   * Handles custom date range input
   */
  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        preset: 'custom',
        [field]: value,
      },
    });
  };

  /**
   * Handles type filter change
   */
  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    // Clear incompatible category selections when type changes
    let updatedCategories = filters.categories;

    if (type !== 'all') {
      // Filter out categories that don't match the selected type
      updatedCategories = filters.categories.filter(categoryId => {
        const category = getCategoryById(categoryId);
        return category && category.type === type;
      });
    }

    setFilters({
      ...filters,
      type,
      categories: updatedCategories,
    });
  };

  /**
   * Toggles category selection
   */
  const toggleCategory = (categoryId: string) => {
    const isSelected = filters.categories.includes(categoryId);

    if (isSelected) {
      setFilters({
        ...filters,
        categories: filters.categories.filter(id => id !== categoryId),
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, categoryId],
      });
    }
  };

  /**
   * Removes a specific category from filters
   */
  const removeCategory = (categoryId: string) => {
    setFilters({
      ...filters,
      categories: filters.categories.filter(id => id !== categoryId),
    });
  };

  /**
   * Gets categories to display in dropdown based on type filter
   */
  const getAvailableCategories = () => {
    if (filters.type === 'all') {
      return categories;
    }
    return getCategoriesByType(filters.type);
  };

  /**
   * Counts active filters
   */
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.dateRange.preset !== 'all') count++;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.type !== 'all') count++;
    if (filters.searchText) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const isDefault = isFiltersDefault(filters);
  const availableCategories = getAvailableCategories();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {activeFilterCount} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            value={filters.dateRange.preset}
            onChange={e =>
              handleDateRangePreset(
                e.target.value as 'all' | 'thisMonth' | 'lastMonth' | 'custom'
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Custom Date Range Inputs */}
          {filters.dateRange.preset === 'custom' && (
            <div className="mt-2 space-y-2">
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onChange={e => handleCustomDateChange('start', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start date"
              />
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onChange={e => handleCustomDateChange('end', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="End date"
              />
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTypeChange('income')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories{' '}
            {filters.categories.length > 0 && `(${filters.categories.length})`}
          </label>
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-700">
              {filters.categories.length === 0
                ? 'Select categories'
                : `${filters.categories.length} selected`}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Category Dropdown */}
          {categoryDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {availableCategories.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No categories available
                </div>
              ) : (
                availableCategories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by description..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {!isDefault && (
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Active filters:
          </span>

          {/* Date Range Badge */}
          {filters.dateRange.preset !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {filters.dateRange.preset === 'thisMonth' && 'This Month'}
              {filters.dateRange.preset === 'lastMonth' && 'Last Month'}
              {filters.dateRange.preset === 'custom' && 'Custom Range'}
              <button
                onClick={() => handleDateRangePreset('all')}
                className="hover:text-blue-900"
                aria-label="Remove date filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Type Badge */}
          {filters.type !== 'all' && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                filters.type === 'income'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {filters.type === 'income' ? 'Income Only' : 'Expense Only'}
              <button
                onClick={() => handleTypeChange('all')}
                className="hover:opacity-80"
                aria-label="Remove type filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Category Badges */}
          {filters.categories.map(categoryId => {
            const category = getCategoryById(categoryId);
            if (!category) return null;

            return (
              <span
                key={categoryId}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.name}
                <button
                  onClick={() => removeCategory(categoryId)}
                  className="hover:opacity-80"
                  aria-label={`Remove ${category.name} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {/* Search Badge */}
          {filters.searchText && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              Search: "{filters.searchText}"
              <button
                onClick={() => setSearchInput('')}
                className="hover:text-purple-900"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Clear All Filters Button */}
      {!isDefault && (
        <button
          onClick={clearFilters}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
