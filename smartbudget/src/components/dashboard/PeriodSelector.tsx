/**
 * PeriodSelector Component
 *
 * Provides UI for selecting time periods to filter financial data.
 * Supports preset periods (This Month, Last Month, Last 3 Months) and custom date ranges.
 *
 * @module components/dashboard/PeriodSelector
 */

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { usePeriod } from '../../hooks/usePeriod';
import type { Period, PeriodType } from '../../models/Period';
import { formatCustomLabel } from '../../utils/periodHelpers';
import { validateDateRange } from '../../utils/validators';

/**
 * PeriodSelector component props
 */
interface PeriodSelectorProps {
  /**
   * Optional CSS class name for custom styling
   */
  className?: string;
}

/**
 * PeriodSelector Component
 *
 * Displays a dropdown for period selection with preset options and custom range picker.
 * Updates global period state via AppContext when user selects a new period.
 *
 * Features:
 * - Dropdown with preset periods (This Month, Last Month, Last 3 Months)
 * - Custom date range picker with validation
 * - Accessible with ARIA attributes and keyboard navigation
 * - Responsive design
 *
 * @param props - Component props
 * @returns JSX element
 */
export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  className = '',
}) => {
  const { selectedPeriod, setPeriod, periodOptions } = usePeriod();

  // Custom range picker state
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Handle preset period selection from dropdown
   */
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PeriodType | 'custom';

    if (value === 'custom') {
      // Open custom range picker
      setShowCustomPicker(true);
      setValidationError(null);
    } else {
      // Find and select preset period
      const period = periodOptions.find(p => p.type === value);
      if (period) {
        setPeriod(period);
      }
    }
  };

  /**
   * Handle applying custom date range
   */
  const handleApplyCustomRange = () => {
    // Validate date range
    const validation = validateDateRange(customStart, customEnd);

    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid date range');
      return;
    }

    // Create custom period
    const label = formatCustomLabel(customStart, customEnd);
    const customPeriod: Period = {
      type: 'custom',
      startDate: customStart,
      endDate: customEnd,
      label,
    };

    // Update period and close picker
    setPeriod(customPeriod);
    setShowCustomPicker(false);
    setValidationError(null);
    setCustomStart('');
    setCustomEnd('');
  };

  /**
   * Handle canceling custom range selection
   */
  const handleCancelCustomRange = () => {
    setShowCustomPicker(false);
    setValidationError(null);
    setCustomStart('');
    setCustomEnd('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Period Dropdown */}
      <div className="relative inline-block">
        <label htmlFor="period-select" className="sr-only">
          Select time period
        </label>
        <div className="relative">
          <select
            id="period-select"
            value={selectedPeriod.type}
            onChange={handlePeriodChange}
            aria-label="Select time period"
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {/* Preset period options */}
            {periodOptions.map(period => (
              <option key={period.type} value={period.type}>
                {period.label}
              </option>
            ))}
            {/* Custom range option */}
            <option value="custom">Custom Range...</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Selected period label (live region for screen readers) */}
      <div aria-live="polite" className="sr-only">
        Currently selected: {selectedPeriod.label}
      </div>

      {/* Custom Date Range Picker Modal */}
      {showCustomPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Custom Date Range
              </h3>
              <button
                onClick={handleCancelCustomRange}
                aria-label="Close custom range picker"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4 mb-4">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={customStart}
                  onChange={e => {
                    setCustomStart(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={customEnd}
                  onChange={e => {
                    setCustomEnd(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div
                role="alert"
                aria-describedby="date-range-error"
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p id="date-range-error" className="text-sm text-red-800">
                  {validationError}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelCustomRange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomRange}
                disabled={!customStart || !customEnd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
