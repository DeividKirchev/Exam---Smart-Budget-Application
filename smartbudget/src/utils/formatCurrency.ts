/**
 * Currency Formatting Utility
 *
 * Provides consistent USD currency formatting across the application.
 * Uses Intl.NumberFormat for locale-aware formatting.
 *
 * @module utils/formatCurrency
 */

/**
 * Format a number as USD currency
 *
 * Formats the amount with dollar sign, comma thousands separator, and 2 decimal places.
 * Handles negative amounts, zero, and large numbers correctly.
 *
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "$1,234.56", "-$123.45", "$0.00")
 *
 * @example
 * formatCurrency(1234.56)    // Returns: "$1,234.56"
 * formatCurrency(0)          // Returns: "$0.00"
 * formatCurrency(-123.45)    // Returns: "-$123.45"
 * formatCurrency(1000000)    // Returns: "$1,000,000.00"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
