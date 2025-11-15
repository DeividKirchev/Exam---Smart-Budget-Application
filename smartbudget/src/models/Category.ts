/**
 * Category Model
 *
 * Represents a transaction category for organizing income and expenses.
 * Categories are predefined and include visual metadata (color, icon) for UI display.
 *
 * @module models/Category
 */

/**
 * Category interface representing a transaction category
 *
 * @interface Category
 * @property {string} id - Unique category identifier
 * @property {string} name - Display name of the category
 * @property {'income' | 'expense'} type - Category type (income or expense)
 * @property {string} color - Hex color code for UI display (e.g., "#10B981")
 * @property {string} icon - Lucide icon name for UI display (e.g., "DollarSign")
 */
export interface Category {
  /**
   * Unique category identifier
   * Used as foreign key in Transaction.category
   */
  id: string;

  /**
   * Display name of the category
   * Examples: "Salary", "Groceries", "Entertainment"
   */
  name: string;

  /**
   * Category type - must match associated transaction type
   * Only 'income' or 'expense' allowed
   */
  type: 'income' | 'expense';

  /**
   * Hex color code for UI visualization
   * Format: "#RRGGBB" (e.g., "#10B981" for green, "#EF4444" for red)
   * Income categories use green family, expense categories use red/orange family
   */
  color: string;

  /**
   * Lucide icon name for UI display
   * Examples: "DollarSign", "ShoppingCart", "Coffee"
   * See: https://lucide.dev for available icons
   */
  icon: string;
}
