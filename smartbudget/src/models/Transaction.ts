/**
 * Transaction Model
 *
 * Represents a financial transaction (income or expense) in the budget application.
 * All transactions are stored in localStorage and must pass validation before persistence.
 *
 * @module models/Transaction
 */

/**
 * Transaction interface representing a single financial transaction
 *
 * @interface Transaction
 * @property {string} id - Unique identifier (UUID v4 format)
 * @property {number} amount - Transaction amount (must be positive, max 2 decimal places)
 * @property {string} date - Transaction date in ISO 8601 format (YYYY-MM-DD)
 * @property {string} category - Foreign key reference to Category.id
 * @property {'income' | 'expense'} type - Transaction type (income or expense)
 * @property {string} description - User-provided description (max 200 chars, sanitized for XSS)
 * @property {string} createdAt - Creation timestamp in ISO 8601 format
 * @property {string} updatedAt - Last update timestamp in ISO 8601 format
 */
export interface Transaction {
  /** Unique identifier in UUID v4 format */
  id: string;

  /**
   * Transaction amount
   * Constraints: Must be > 0, finite number, max 2 decimal places
   */
  amount: number;

  /**
   * Transaction date in ISO 8601 format (YYYY-MM-DD)
   * Constraints: Valid date, not more than 1 year in future
   */
  date: string;

  /**
   * Category ID reference
   * Constraints: Must exist in predefined categories list
   */
  category: string;

  /**
   * Transaction type
   * Only 'income' or 'expense' allowed
   */
  type: 'income' | 'expense';

  /**
   * User-provided transaction description
   * Constraints: Max 200 characters, HTML entity encoded for XSS prevention
   */
  description: string;

  /**
   * Creation timestamp in ISO 8601 format
   * Auto-generated on transaction creation
   */
  createdAt: string;

  /**
   * Last update timestamp in ISO 8601 format
   * Auto-updated on transaction modification
   */
  updatedAt: string;
}
