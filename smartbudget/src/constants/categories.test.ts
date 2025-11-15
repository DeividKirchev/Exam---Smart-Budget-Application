/**
 * Unit tests for categories module
 *
 * Tests category data structure, helper functions, and data integrity
 */

import { describe, it, expect } from 'vitest';
import { CATEGORIES, getCategoryById, getCategoriesByType } from './categories';

describe('categories', () => {
  describe('CATEGORIES constant', () => {
    it('should have exactly 12 categories total', () => {
      expect(CATEGORIES).toHaveLength(12);
    });

    it('should be exported and accessible', () => {
      expect(CATEGORIES).toBeDefined();
      expect(Array.isArray(CATEGORIES)).toBe(true);
    });
  });

  describe('Income categories', () => {
    it('should have exactly 4 income categories', () => {
      const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');
      expect(incomeCategories).toHaveLength(4);
    });

    it('should have all income categories with type="income"', () => {
      const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');
      incomeCategories.forEach(cat => {
        expect(cat.type).toBe('income');
      });
    });

    it('should have all income categories with green color palette', () => {
      const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');
      incomeCategories.forEach(cat => {
        // Green colors start with #0 or #1 (emerald family)
        expect(cat.color.startsWith('#0') || cat.color.startsWith('#1')).toBe(
          true
        );
      });
    });

    it('should have correct income category IDs', () => {
      const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');
      const incomeIds = incomeCategories.map(cat => cat.id);

      expect(incomeIds).toContain('salary');
      expect(incomeIds).toContain('freelance');
      expect(incomeIds).toContain('investment');
      expect(incomeIds).toContain('other-income');
    });

    it('should have salary category with correct properties', () => {
      const salary = getCategoryById('salary');

      expect(salary).toBeDefined();
      expect(salary?.name).toBe('Salary');
      expect(salary?.type).toBe('income');
      expect(salary?.color).toBe('#10B981');
      expect(salary?.icon).toBe('Wallet');
    });

    it('should have freelance category with correct properties', () => {
      const freelance = getCategoryById('freelance');

      expect(freelance).toBeDefined();
      expect(freelance?.name).toBe('Freelance');
      expect(freelance?.type).toBe('income');
      expect(freelance?.color).toBe('#059669');
      expect(freelance?.icon).toBe('Briefcase');
    });

    it('should have investment category with correct properties', () => {
      const investment = getCategoryById('investment');

      expect(investment).toBeDefined();
      expect(investment?.name).toBe('Investment');
      expect(investment?.type).toBe('income');
      expect(investment?.color).toBe('#047857');
      expect(investment?.icon).toBe('TrendingUp');
    });

    it('should have other-income category with correct properties', () => {
      const otherIncome = getCategoryById('other-income');

      expect(otherIncome).toBeDefined();
      expect(otherIncome?.name).toBe('Other Income');
      expect(otherIncome?.type).toBe('income');
      expect(otherIncome?.color).toBe('#065F46');
      expect(otherIncome?.icon).toBe('PiggyBank');
    });
  });

  describe('Expense categories', () => {
    it('should have exactly 8 expense categories', () => {
      const expenseCategories = CATEGORIES.filter(
        cat => cat.type === 'expense'
      );
      expect(expenseCategories).toHaveLength(8);
    });

    it('should have all expense categories with type="expense"', () => {
      const expenseCategories = CATEGORIES.filter(
        cat => cat.type === 'expense'
      );
      expenseCategories.forEach(cat => {
        expect(cat.type).toBe('expense');
      });
    });

    it('should have expense categories with red/amber color palette', () => {
      const expenseCategories = CATEGORIES.filter(
        cat => cat.type === 'expense'
      );
      expenseCategories.forEach(cat => {
        // Red/amber colors start with #E, #D, #B, #9, or #F
        const firstChar = cat.color.charAt(1).toUpperCase();
        expect(['E', 'D', 'B', '9', 'F']).toContain(firstChar);
      });
    });

    it('should have correct expense category IDs', () => {
      const expenseCategories = CATEGORIES.filter(
        cat => cat.type === 'expense'
      );
      const expenseIds = expenseCategories.map(cat => cat.id);

      expect(expenseIds).toContain('rent');
      expect(expenseIds).toContain('transport');
      expect(expenseIds).toContain('food');
      expect(expenseIds).toContain('entertainment');
      expect(expenseIds).toContain('utilities');
      expect(expenseIds).toContain('healthcare');
      expect(expenseIds).toContain('shopping');
      expect(expenseIds).toContain('other-expense');
    });

    it('should have rent category with correct properties', () => {
      const rent = getCategoryById('rent');

      expect(rent).toBeDefined();
      expect(rent?.name).toBe('Rent/Mortgage');
      expect(rent?.type).toBe('expense');
      expect(rent?.color).toBe('#EF4444');
      expect(rent?.icon).toBe('Home');
    });

    it('should have transport category with correct properties', () => {
      const transport = getCategoryById('transport');

      expect(transport).toBeDefined();
      expect(transport?.name).toBe('Transport');
      expect(transport?.type).toBe('expense');
      expect(transport?.color).toBe('#DC2626');
      expect(transport?.icon).toBe('Car');
    });

    it('should have food category with correct properties', () => {
      const food = getCategoryById('food');

      expect(food).toBeDefined();
      expect(food?.name).toBe('Food/Groceries');
      expect(food?.type).toBe('expense');
      expect(food?.color).toBe('#B91C1C');
      expect(food?.icon).toBe('ShoppingCart');
    });

    it('should have entertainment category with correct properties', () => {
      const entertainment = getCategoryById('entertainment');

      expect(entertainment).toBeDefined();
      expect(entertainment?.name).toBe('Entertainment');
      expect(entertainment?.type).toBe('expense');
      expect(entertainment?.color).toBe('#991B1B');
      expect(entertainment?.icon).toBe('Film');
    });

    it('should have utilities category with correct properties', () => {
      const utilities = getCategoryById('utilities');

      expect(utilities).toBeDefined();
      expect(utilities?.name).toBe('Utilities');
      expect(utilities?.type).toBe('expense');
      expect(utilities?.color).toBe('#F59E0B');
      expect(utilities?.icon).toBe('Lightbulb');
    });

    it('should have healthcare category with correct properties', () => {
      const healthcare = getCategoryById('healthcare');

      expect(healthcare).toBeDefined();
      expect(healthcare?.name).toBe('Healthcare');
      expect(healthcare?.type).toBe('expense');
      expect(healthcare?.color).toBe('#D97706');
      expect(healthcare?.icon).toBe('Heart');
    });

    it('should have shopping category with correct properties', () => {
      const shopping = getCategoryById('shopping');

      expect(shopping).toBeDefined();
      expect(shopping?.name).toBe('Shopping');
      expect(shopping?.type).toBe('expense');
      expect(shopping?.color).toBe('#B45309');
      expect(shopping?.icon).toBe('ShoppingBag');
    });

    it('should have other-expense category with correct properties', () => {
      const otherExpense = getCategoryById('other-expense');

      expect(otherExpense).toBeDefined();
      expect(otherExpense?.name).toBe('Other Expense');
      expect(otherExpense?.type).toBe('expense');
      expect(otherExpense?.color).toBe('#92400E');
      expect(otherExpense?.icon).toBe('MoreHorizontal');
    });
  });

  describe('Category data structure', () => {
    it('should have each category with exactly 5 properties', () => {
      CATEGORIES.forEach(category => {
        const keys = Object.keys(category);
        expect(keys).toHaveLength(5);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).toContain('type');
        expect(keys).toContain('color');
        expect(keys).toContain('icon');
      });
    });

    it('should have all category IDs in kebab-case format', () => {
      const kebabCasePattern = /^[a-z]+(-[a-z]+)*$/;

      CATEGORIES.forEach(category => {
        expect(category.id).toMatch(kebabCasePattern);
      });
    });

    it('should have all colors in valid hex format #RRGGBB', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;

      CATEGORIES.forEach(category => {
        expect(category.color).toMatch(hexPattern);
        expect(category.color).toHaveLength(7);
      });
    });

    it('should have all icon names as strings', () => {
      CATEGORIES.forEach(category => {
        expect(typeof category.icon).toBe('string');
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have all category IDs unique (no duplicates)', () => {
      const ids = CATEGORIES.map(cat => cat.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all icons in PascalCase format', () => {
      const pascalCasePattern = /^[A-Z][a-zA-Z]*$/;

      CATEGORIES.forEach(category => {
        expect(category.icon).toMatch(pascalCasePattern);
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return correct category for valid ID', () => {
      const salary = getCategoryById('salary');

      expect(salary).toBeDefined();
      expect(salary?.id).toBe('salary');
      expect(salary?.name).toBe('Salary');
    });

    it('should return undefined for non-existent ID', () => {
      const result = getCategoryById('fake-category');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = getCategoryById('');

      expect(result).toBeUndefined();
    });

    it('should return correct category for all valid income IDs', () => {
      expect(getCategoryById('salary')).toBeDefined();
      expect(getCategoryById('freelance')).toBeDefined();
      expect(getCategoryById('investment')).toBeDefined();
      expect(getCategoryById('other-income')).toBeDefined();
    });

    it('should return correct category for all valid expense IDs', () => {
      expect(getCategoryById('rent')).toBeDefined();
      expect(getCategoryById('transport')).toBeDefined();
      expect(getCategoryById('food')).toBeDefined();
      expect(getCategoryById('entertainment')).toBeDefined();
      expect(getCategoryById('utilities')).toBeDefined();
      expect(getCategoryById('healthcare')).toBeDefined();
      expect(getCategoryById('shopping')).toBeDefined();
      expect(getCategoryById('other-expense')).toBeDefined();
    });
  });

  describe('getCategoriesByType', () => {
    it('should return exactly 4 categories for income type', () => {
      const incomeCategories = getCategoriesByType('income');

      expect(incomeCategories).toHaveLength(4);
    });

    it('should return exactly 8 categories for expense type', () => {
      const expenseCategories = getCategoriesByType('expense');

      expect(expenseCategories).toHaveLength(8);
    });

    it('should return only income categories when type is income', () => {
      const incomeCategories = getCategoriesByType('income');

      incomeCategories.forEach(cat => {
        expect(cat.type).toBe('income');
      });
    });

    it('should return only expense categories when type is expense', () => {
      const expenseCategories = getCategoriesByType('expense');

      expenseCategories.forEach(cat => {
        expect(cat.type).toBe('expense');
      });
    });

    it('should return array with correct income category IDs', () => {
      const incomeCategories = getCategoriesByType('income');
      const ids = incomeCategories.map(cat => cat.id);

      expect(ids).toContain('salary');
      expect(ids).toContain('freelance');
      expect(ids).toContain('investment');
      expect(ids).toContain('other-income');
    });

    it('should return array with correct expense category IDs', () => {
      const expenseCategories = getCategoriesByType('expense');
      const ids = expenseCategories.map(cat => cat.id);

      expect(ids).toContain('rent');
      expect(ids).toContain('transport');
      expect(ids).toContain('food');
      expect(ids).toContain('entertainment');
      expect(ids).toContain('utilities');
      expect(ids).toContain('healthcare');
      expect(ids).toContain('shopping');
      expect(ids).toContain('other-expense');
    });
  });
});
