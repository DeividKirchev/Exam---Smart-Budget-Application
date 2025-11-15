/**
 * Validation Utilities
 *
 * Provides validation functions for transaction data to ensure data integrity and security.
 * All validators follow a consistent return pattern: { valid: boolean; error?: string }
 *
 * @module utils/validators
 */

import { parseISO, isValid, isFuture } from 'date-fns';
import type { Transaction } from '../models/Transaction';
import { CATEGORIES } from '../constants/categories';

/**
 * Validation result type
 * Used by all validation functions for consistency
 */
export type ValidationResult = {
  /** Whether the validation passed */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
};

/**
 * Validates transaction amount
 *
 * Business rules:
 * - Must be a finite number (not NaN or Infinity)
 * - Must be greater than zero
 * - Cannot have more than 2 decimal places
 *
 * @param amount - The amount to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateAmount(10.50) // { valid: true }
 * validateAmount(-5) // { valid: false, error: "Amount must be greater than zero" }
 * validateAmount(10.123) // { valid: false, error: "Amount cannot have more than 2 decimal places" }
 */
export const validateAmount = (amount: number): ValidationResult => {
  // Check if amount is a finite number
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { valid: false, error: 'Amount must be a finite number' };
  }

  // Check if amount is positive
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }

  // Check decimal places (max 2)
  const amountString = amount.toString();
  const decimalPart = amountString.split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return {
      valid: false,
      error: 'Amount cannot have more than 2 decimal places',
    };
  }

  return { valid: true };
};

/**
 * Validates transaction date
 *
 * Business rules:
 * - Must be a valid date string
 * - Must be in ISO 8601 format (YYYY-MM-DD)
 * - Cannot be more than 1 year in the future (per PRD NFR-2.2)
 *
 * @param date - The date string to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateDate("2025-11-15") // { valid: true }
 * validateDate("invalid") // { valid: false, error: "Date must be a valid date string" }
 * validateDate("2027-01-01") // { valid: false, error: "Date cannot be more than 1 year in the future" }
 */
export const validateDate = (date: string): ValidationResult => {
  // Check if date string is provided
  if (typeof date !== 'string' || date.trim() === '') {
    return { valid: false, error: 'Date must be a non-empty string' };
  }

  // Validate ISO 8601 format (YYYY-MM-DD)
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso8601Regex.test(date)) {
    return {
      valid: false,
      error: 'Date must be in ISO 8601 format (YYYY-MM-DD)',
    };
  }

  // Check if date is valid and not auto-corrected
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Date must be a valid date string' };
  }

  // Verify the date wasn't auto-corrected (e.g., 2025-02-30 -> 2025-03-02)
  const isoString = dateObj.toISOString().split('T')[0];
  if (isoString !== date) {
    return { valid: false, error: 'Date must be a valid date string' };
  }

  // Check if date is not more than 1 year in the future
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (dateObj > oneYearFromNow) {
    return {
      valid: false,
      error: 'Date cannot be more than 1 year in the future',
    };
  }

  return { valid: true };
};

/**
 * Validates category ID and type match
 *
 * Business rules:
 * - Category ID must exist in predefined categories list
 * - Category type must match the transaction type
 *
 * @param categoryId - The category ID to validate
 * @param type - The transaction type ('income' or 'expense')
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateCategory("salary", "income") // { valid: true }
 * validateCategory("fake-category", "income") // { valid: false, error: "Category ID does not exist" }
 * validateCategory("salary", "expense") // { valid: false, error: "Category type does not match transaction type" }
 */
export const validateCategory = (
  categoryId: string,
  type: 'income' | 'expense'
): ValidationResult => {
  // Check if categoryId is provided
  if (typeof categoryId !== 'string' || categoryId.trim() === '') {
    return { valid: false, error: 'Category ID must be a non-empty string' };
  }

  // Check if category exists in CATEGORIES with matching type
  const category = CATEGORIES.find(c => c.id === categoryId && c.type === type);
  if (!category) {
    return {
      valid: false,
      error: 'Category ID does not exist in predefined list',
    };
  }

  return { valid: true };
};

/**
 * Sanitizes description string to prevent XSS attacks
 *
 * Security measures:
 * - HTML entity encodes dangerous characters: < > " '
 * - Trims leading/trailing whitespace
 * - Enforces 200 character maximum length
 *
 * @param input - The description string to sanitize
 * @returns Sanitized description string (safe for storage and display)
 *
 * @example
 * sanitizeDescription("Valid description") // "Valid description"
 * sanitizeDescription("<script>alert('xss')</script>") // "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
 * sanitizeDescription("  padded  ") // "padded"
 */
export const sanitizeDescription = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .substring(0, 200); // Enforce max length
};

/**
 * Comprehensive validation result for transaction data
 */
export type TransactionValidationResult = {
  /** Whether all validations passed */
  valid: boolean;
  /** Map of field names to error messages */
  errors: Record<string, string>;
};

/**
 * Validates complete transaction data
 *
 * Orchestrates all individual validators to provide comprehensive validation.
 * Runs all validators and collects errors for each field.
 *
 * @param data - Partial transaction data to validate
 * @returns Comprehensive validation result with all field errors
 *
 * @example
 * validateTransactionData({ amount: 10.50, date: "2025-11-15", category: "salary", type: "income" })
 * // { valid: true, errors: {} }
 *
 * validateTransactionData({ amount: -10, date: "invalid", category: "fake", type: "income" })
 * // { valid: false, errors: { amount: "...", date: "...", category: "..." } }
 */
export const validateTransactionData = (
  data: Partial<Transaction>
): TransactionValidationResult => {
  const errors: Record<string, string> = {};

  // Validate amount if provided
  if (data.amount !== undefined) {
    const amountResult = validateAmount(data.amount);
    if (!amountResult.valid && amountResult.error) {
      errors.amount = amountResult.error;
    }
  }

  // Validate date if provided
  if (data.date !== undefined) {
    const dateResult = validateDate(data.date);
    if (!dateResult.valid && dateResult.error) {
      errors.date = dateResult.error;
    }
  }

  // Validate category if both category and type are provided
  if (data.category !== undefined && data.type !== undefined) {
    const categoryResult = validateCategory(data.category, data.type);
    if (!categoryResult.valid && categoryResult.error) {
      errors.category = categoryResult.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a custom date range
 *
 * Business rules for custom date ranges:
 * - Start and end dates must be valid ISO 8601 strings
 * - End date must be after or equal to start date (cannot be inverted)
 * - End date cannot be in the future
 *
 * @param start - Start date in ISO 8601 format (YYYY-MM-DD)
 * @param end - End date in ISO 8601 format (YYYY-MM-DD)
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateDateRange('2025-11-01', '2025-11-15') // { valid: true }
 * validateDateRange('2025-11-15', '2025-11-01') // { valid: false, error: 'End date must be after or equal to start date' }
 * validateDateRange('2025-11-01', '2026-12-31') // { valid: false, error: 'End date cannot be in the future' }
 */
export const validateDateRange = (
  start: string,
  end: string
): ValidationResult => {
  // Parse dates
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  // Check valid date format
  if (!isValid(startDate)) {
    return { valid: false, error: 'Invalid start date format' };
  }

  if (!isValid(endDate)) {
    return { valid: false, error: 'Invalid end date format' };
  }

  // Check end date is not before start date
  if (endDate < startDate) {
    return {
      valid: false,
      error: 'End date must be after or equal to start date',
    };
  }

  // Check end date is not in the future
  if (isFuture(endDate)) {
    return { valid: false, error: 'End date cannot be in the future' };
  }

  return { valid: true };
};
