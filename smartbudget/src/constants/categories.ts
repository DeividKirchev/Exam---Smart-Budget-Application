/**
 * Predefined Categories Module
 *
 * Contains the complete list of predefined income and expense categories
 * for the SmartBudget application. Categories are read-only and cannot be
 * customized by users in the MVP version.
 *
 * @module categories
 */

import type { Category } from '../models/Category';

/**
 * Income categories (4 total)
 * All income categories use emerald green color palette (#10B981 family)
 */
const incomeCategories: Category[] = [
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    color: '#10B981',
    icon: 'Wallet',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    color: '#059669',
    icon: 'Briefcase',
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'income',
    color: '#047857',
    icon: 'TrendingUp',
  },
  {
    id: 'other-income',
    name: 'Other Income',
    type: 'income',
    color: '#065F46',
    icon: 'PiggyBank',
  },
];

/**
 * Expense categories (8 total)
 * Essential expenses use red color palette (#EF4444 family)
 * Utilities and discretionary expenses use amber color palette (#F59E0B family)
 */
const expenseCategories: Category[] = [
  {
    id: 'rent',
    name: 'Rent/Mortgage',
    type: 'expense',
    color: '#EF4444',
    icon: 'Home',
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    color: '#DC2626',
    icon: 'Car',
  },
  {
    id: 'food',
    name: 'Food/Groceries',
    type: 'expense',
    color: '#B91C1C',
    icon: 'ShoppingCart',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    color: '#991B1B',
    icon: 'Film',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    type: 'expense',
    color: '#F59E0B',
    icon: 'Lightbulb',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    type: 'expense',
    color: '#D97706',
    icon: 'Heart',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    color: '#B45309',
    icon: 'ShoppingBag',
  },
  {
    id: 'other-expense',
    name: 'Other Expense',
    type: 'expense',
    color: '#92400E',
    icon: 'MoreHorizontal',
  },
];

/**
 * Complete list of predefined categories for SmartBudget application.
 *
 * Contains 12 categories total:
 * - 4 income categories (green color palette)
 * - 8 expense categories (red and amber color palettes)
 *
 * Categories are read-only and cannot be modified by users in MVP.
 * Each category includes: id (kebab-case), name, type, color (hex), and icon (Lucide React name).
 *
 * @example
 * // Import and use categories
 * import { CATEGORIES } from './constants/categories';
 *
 * const allCategories = CATEGORIES;
 * console.log(allCategories.length); // 12
 */
export const CATEGORIES = [
  ...incomeCategories,
  ...expenseCategories,
] as const satisfies readonly Category[];

/**
 * Retrieves a category by its unique ID.
 *
 * @param {string} id - The category ID to search for (e.g., 'salary', 'food')
 * @returns {Category | undefined} The matching category object, or undefined if not found
 *
 * @example
 * const salaryCategory = getCategoryById('salary');
 * console.log(salaryCategory?.name); // "Salary"
 *
 * const notFound = getCategoryById('invalid-id');
 * console.log(notFound); // undefined
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(category => category.id === id);
}

/**
 * Filters categories by type (income or expense).
 *
 * @param {('income' | 'expense')} type - The category type to filter by
 * @returns {Category[]} Array of categories matching the specified type
 *
 * @example
 * const incomeCategories = getCategoriesByType('income');
 * console.log(incomeCategories.length); // 4
 *
 * const expenseCategories = getCategoriesByType('expense');
 * console.log(expenseCategories.length); // 8
 */
export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
  return CATEGORIES.filter(category => category.type === type);
}
