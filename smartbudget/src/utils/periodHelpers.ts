/**
 * Period Helper Utilities
 *
 * Provides utility functions for calculating and formatting time periods.
 * Used by PeriodSelector component and period management logic.
 *
 * @module utils/periodHelpers
 */

import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import type { Period } from '../models/Period';

/**
 * Get the current month period
 *
 * Calculates period for the current calendar month from first to last day.
 *
 * @returns Period object for this month
 *
 * @example
 * // If today is November 15, 2025
 * getThisMonth() // Returns { type: 'this-month', startDate: '2025-11-01', endDate: '2025-11-30', label: 'This Month' }
 */
export const getThisMonth = (): Period => {
  const now = new Date();
  return {
    type: 'this-month',
    startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
    label: 'This Month',
  };
};

/**
 * Get the previous month period
 *
 * Calculates period for the previous calendar month from first to last day.
 *
 * @returns Period object for last month
 *
 * @example
 * // If today is November 15, 2025
 * getLastMonth() // Returns { type: 'last-month', startDate: '2025-10-01', endDate: '2025-10-31', label: 'Last Month' }
 */
export const getLastMonth = (): Period => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  return {
    type: 'last-month',
    startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
    label: 'Last Month',
  };
};

/**
 * Get the last 3 months period
 *
 * Calculates period starting 3 months ago from the first day of that month to today.
 *
 * @returns Period object for last 3 months
 *
 * @example
 * // If today is November 15, 2025
 * getLast3Months() // Returns { type: 'last-3-months', startDate: '2025-08-01', endDate: '2025-11-15', label: 'Last 3 Months' }
 */
export const getLast3Months = (): Period => {
  const now = new Date();
  const threeMonthsAgo = subMonths(now, 3);
  return {
    type: 'last-3-months',
    startDate: format(startOfMonth(threeMonthsAgo), 'yyyy-MM-dd'),
    endDate: format(now, 'yyyy-MM-dd'),
    label: 'Last 3 Months',
  };
};

/**
 * Format custom date range as human-readable label
 *
 * Converts ISO date strings to a readable label format.
 *
 * @param startDate - Start date in ISO 8601 format (YYYY-MM-DD)
 * @param endDate - End date in ISO 8601 format (YYYY-MM-DD)
 * @returns Formatted label string
 *
 * @example
 * formatCustomLabel('2025-11-01', '2025-11-15') // Returns "Nov 1 - Nov 15, 2025"
 * formatCustomLabel('2025-11-01', '2025-12-15') // Returns "Nov 1 - Dec 15, 2025"
 */
export const formatCustomLabel = (
  startDate: string,
  endDate: string
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Format as "Nov 1 - Nov 15, 2025" or "Nov 1 - Dec 15, 2025"
  const startMonth = format(start, 'MMM');
  const startDay = format(start, 'd');
  const endMonth = format(end, 'MMM');
  const endDay = format(end, 'd');
  const year = format(end, 'yyyy');

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
};

/**
 * Get all preset period options
 *
 * Returns an array of all predefined period options (This Month, Last Month, Last 3 Months).
 * Used to populate period selector dropdown.
 *
 * @returns Array of preset Period objects
 */
export const getAllPresetPeriods = (): Period[] => {
  return [getThisMonth(), getLastMonth(), getLast3Months()];
};
