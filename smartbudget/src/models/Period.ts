/**
 * Period Model
 *
 * Represents a time period for filtering and displaying financial data.
 * Supports predefined periods (this month, last month, last 3 months) and custom date ranges.
 *
 * @module models/Period
 */

/**
 * Period type enumeration
 *
 * Defines the available predefined period types and custom option.
 * - 'this-month': Current calendar month
 * - 'last-month': Previous calendar month
 * - 'last-3-months': Last 3 calendar months including current
 * - 'custom': User-defined date range
 */
export type PeriodType =
  | 'this-month'
  | 'last-month'
  | 'last-3-months'
  | 'custom';

/**
 * Period interface representing a time period for data filtering
 *
 * @interface Period
 * @property {PeriodType} type - The period type (predefined or custom)
 * @property {string} startDate - Period start date in ISO 8601 format (YYYY-MM-DD)
 * @property {string} endDate - Period end date in ISO 8601 format (YYYY-MM-DD)
 * @property {string} label - Human-readable label for UI display
 */
export interface Period {
  /**
   * Period type identifier
   * Determines how the period is calculated and displayed
   */
  type: PeriodType;

  /**
   * Period start date in ISO 8601 format
   * Format: YYYY-MM-DD (e.g., "2025-11-01")
   * Inclusive - transactions on this date are included
   */
  startDate: string;

  /**
   * Period end date in ISO 8601 format
   * Format: YYYY-MM-DD (e.g., "2025-11-30")
   * Inclusive - transactions on this date are included
   */
  endDate: string;

  /**
   * Human-readable label for UI display
   * Examples: "This Month", "Last Month", "Nov 1 - Nov 30, 2025"
   */
  label: string;
}
