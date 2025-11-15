/**
 * Validator Unit Tests
 *
 * Comprehensive test suite for validation utilities covering:
 * - Valid inputs (happy path)
 * - Invalid inputs (error cases)
 * - Edge cases and boundary conditions
 * - Security concerns (XSS prevention)
 *
 * Target coverage: ≥90% for validators.ts
 *
 * @module utils/validators.test
 */

import { describe, it, expect } from 'vitest';
import {
  validateAmount,
  validateDate,
  validateCategory,
  sanitizeDescription,
  validateTransactionData,
  validateDateRange,
} from './validators';

describe('validateAmount', () => {
  describe('valid amounts', () => {
    it('should accept positive integers', () => {
      const result = validateAmount(100);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept positive decimals with 1 decimal place', () => {
      const result = validateAmount(10.5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept positive decimals with 2 decimal places', () => {
      const result = validateAmount(10.99);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept very small positive amounts', () => {
      const result = validateAmount(0.01);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept large amounts', () => {
      const result = validateAmount(999999.99);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('invalid amounts', () => {
    it('should reject negative amounts', () => {
      const result = validateAmount(-10);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be greater than zero');
    });

    it('should reject zero', () => {
      const result = validateAmount(0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be greater than zero');
    });

    it('should reject NaN', () => {
      const result = validateAmount(NaN);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be a finite number');
    });

    it('should reject positive Infinity', () => {
      const result = validateAmount(Infinity);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be a finite number');
    });

    it('should reject negative Infinity', () => {
      const result = validateAmount(-Infinity);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Amount must be a finite number');
    });

    it('should reject amounts with more than 2 decimal places', () => {
      const result = validateAmount(10.123);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Amount cannot have more than 2 decimal places'
      );
    });

    it('should reject amounts with 3 decimal places', () => {
      const result = validateAmount(99.999);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Amount cannot have more than 2 decimal places'
      );
    });
  });
});

describe('validateDate', () => {
  describe('valid dates', () => {
    it("should accept today's date", () => {
      const today = new Date().toISOString().split('T')[0];
      const result = validateDate(today);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept past dates', () => {
      const result = validateDate('2025-01-01');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept dates within 1 year in the future', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 6);
      const dateString = futureDate.toISOString().split('T')[0];
      const result = validateDate(dateString);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept dates exactly 1 year in the future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const result = validateDate(dateString);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('invalid dates', () => {
    it('should reject empty strings', () => {
      const result = validateDate('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be a non-empty string');
    });

    it('should reject whitespace-only strings', () => {
      const result = validateDate('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be a non-empty string');
    });

    it('should reject invalid date strings', () => {
      const result = validateDate('invalid-date');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be in ISO 8601 format (YYYY-MM-DD)');
    });

    it('should reject dates not in ISO 8601 format', () => {
      const result = validateDate('11/15/2025');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be in ISO 8601 format (YYYY-MM-DD)');
    });

    it('should reject dates with invalid months', () => {
      const result = validateDate('2025-13-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be a valid date string');
    });

    it('should reject dates with invalid days', () => {
      const result = validateDate('2025-02-30');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date must be a valid date string');
    });

    it('should reject dates more than 1 year in the future', () => {
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 2);
      const dateString = farFuture.toISOString().split('T')[0];
      const result = validateDate(dateString);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Date cannot be more than 1 year in the future'
      );
    });

    it('should reject dates far in the future', () => {
      const result = validateDate('2027-01-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Date cannot be more than 1 year in the future'
      );
    });
  });
});

describe('validateCategory', () => {
  describe('valid categories', () => {
    it('should accept valid income category', () => {
      const result = validateCategory('salary', 'income');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid expense category', () => {
      const result = validateCategory('food', 'expense');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept all predefined income categories', () => {
      const incomeCategories = [
        'salary',
        'freelance',
        'investment',
        'other-income',
      ];
      incomeCategories.forEach(category => {
        const result = validateCategory(category, 'income');
        expect(result.valid).toBe(true);
      });
    });

    it('should accept all predefined expense categories', () => {
      const expenseCategories = [
        'rent',
        'transport',
        'food',
        'entertainment',
        'utilities',
        'healthcare',
        'shopping',
        'other-expense',
      ];
      expenseCategories.forEach(category => {
        const result = validateCategory(category, 'expense');
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('invalid categories', () => {
    it('should reject empty category ID', () => {
      const result = validateCategory('', 'income');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Category ID must be a non-empty string');
    });

    it('should reject whitespace-only category ID', () => {
      const result = validateCategory('   ', 'expense');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Category ID must be a non-empty string');
    });

    it('should reject non-existent category ID', () => {
      const result = validateCategory('fake-category', 'income');
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Category ID does not exist in predefined list'
      );
    });

    it('should reject category type mismatch (income category used as expense)', () => {
      const result = validateCategory('salary', 'expense');
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Category ID does not exist in predefined list'
      );
    });

    it('should reject category type mismatch (expense category used as income)', () => {
      const result = validateCategory('groceries', 'income');
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Category ID does not exist in predefined list'
      );
    });
  });
});

describe('sanitizeDescription', () => {
  describe('clean input', () => {
    it('should return clean text unchanged', () => {
      const result = sanitizeDescription('Valid transaction description');
      expect(result).toBe('Valid transaction description');
    });

    it('should trim leading whitespace', () => {
      const result = sanitizeDescription('   Valid description');
      expect(result).toBe('Valid description');
    });

    it('should trim trailing whitespace', () => {
      const result = sanitizeDescription('Valid description   ');
      expect(result).toBe('Valid description');
    });

    it('should trim both leading and trailing whitespace', () => {
      const result = sanitizeDescription('   Valid description   ');
      expect(result).toBe('Valid description');
    });
  });

  describe('XSS prevention', () => {
    it('should encode < character', () => {
      const result = sanitizeDescription('Amount < 100');
      expect(result).toBe('Amount &lt; 100');
    });

    it('should encode > character', () => {
      const result = sanitizeDescription('Amount > 50');
      expect(result).toBe('Amount &gt; 50');
    });

    it('should encode double quotes', () => {
      const result = sanitizeDescription('Say "hello"');
      expect(result).toBe('Say &quot;hello&quot;');
    });

    it('should encode single quotes', () => {
      const result = sanitizeDescription("It's a description");
      expect(result).toBe('It&#x27;s a description');
    });

    it('should encode script tags', () => {
      const result = sanitizeDescription('<script>alert("xss")</script>');
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should encode img tags with XSS', () => {
      const result = sanitizeDescription(
        '<img src=x onerror="alert(\'xss\')">'
      );
      expect(result).toBe(
        '&lt;img src=x onerror=&quot;alert(&#x27;xss&#x27;)&quot;&gt;'
      );
    });

    it('should encode all dangerous characters together', () => {
      const result = sanitizeDescription('<>"\'');
      expect(result).toBe('&lt;&gt;&quot;&#x27;');
    });
  });

  describe('length enforcement', () => {
    it('should return descriptions under 200 chars unchanged', () => {
      const input = 'A'.repeat(199);
      const result = sanitizeDescription(input);
      expect(result).toBe(input);
      expect(result.length).toBe(199);
    });

    it('should return descriptions exactly 200 chars unchanged', () => {
      const input = 'A'.repeat(200);
      const result = sanitizeDescription(input);
      expect(result).toBe(input);
      expect(result.length).toBe(200);
    });

    it('should truncate descriptions over 200 chars', () => {
      const input = 'A'.repeat(250);
      const result = sanitizeDescription(input);
      expect(result.length).toBe(200);
      expect(result).toBe('A'.repeat(200));
    });

    it('should truncate very long descriptions', () => {
      const input = 'A'.repeat(500);
      const result = sanitizeDescription(input);
      expect(result.length).toBe(200);
    });
  });

  describe('combined operations', () => {
    it('should trim and sanitize together', () => {
      const result = sanitizeDescription('  <script>alert("xss")</script>  ');
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should sanitize and truncate together', () => {
      const input = '<script>' + 'A'.repeat(300) + '</script>';
      const result = sanitizeDescription(input);
      expect(result.length).toBe(200);
      expect(result.startsWith('&lt;script&gt;')).toBe(true);
    });
  });
});

describe('validateTransactionData', () => {
  describe('valid transaction data', () => {
    it('should validate complete valid transaction data', () => {
      const data = {
        amount: 100.5,
        date: '2025-11-15',
        category: 'salary',
        type: 'income' as const,
      };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should validate partial transaction data (amount only)', () => {
      const data = { amount: 50.0 };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should validate partial transaction data (date only)', () => {
      const data = { date: '2025-11-15' };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('invalid transaction data', () => {
    it('should return error for invalid amount', () => {
      const data = { amount: -10 };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.amount).toBe('Amount must be greater than zero');
    });

    it('should return error for invalid date', () => {
      const data = { date: 'invalid-date' };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.date).toBe(
        'Date must be in ISO 8601 format (YYYY-MM-DD)'
      );
    });

    it('should return error for invalid category', () => {
      const data = {
        category: 'fake-category',
        type: 'income' as const,
      };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.category).toBe(
        'Category ID does not exist in predefined list'
      );
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const data = {
        amount: -10,
        date: 'invalid',
        category: 'fake',
        type: 'income' as const,
      };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.amount).toBeDefined();
      expect(result.errors.date).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(Object.keys(result.errors).length).toBe(3);
    });

    it('should handle NaN amount', () => {
      const data = { amount: NaN };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.amount).toBe('Amount must be a finite number');
    });

    it('should handle amount with too many decimals', () => {
      const data = { amount: 10.123 };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.amount).toBe(
        'Amount cannot have more than 2 decimal places'
      );
    });

    it('should handle far future date', () => {
      const data = { date: '2027-01-01' };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.date).toBe(
        'Date cannot be more than 1 year in the future'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty object', () => {
      const result = validateTransactionData({});
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should skip category validation if type is missing', () => {
      const data = { category: 'salary' };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should skip category validation if category is missing', () => {
      const data = { type: 'income' as const };
      const result = validateTransactionData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('validateDateRange', () => {
    it('should return valid for correct date range', () => {
      const result = validateDateRange('2025-11-01', '2025-11-15');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid when start and end dates are the same', () => {
      const result = validateDateRange('2025-11-15', '2025-11-15');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when end date is before start date', () => {
      const result = validateDateRange('2025-11-15', '2025-11-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'End date must be after or equal to start date'
      );
    });

    it('should return invalid when start date format is invalid', () => {
      const result = validateDateRange('invalid-date', '2025-11-15');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid start date format');
    });

    it('should return invalid when end date format is invalid', () => {
      const result = validateDateRange('2025-11-01', 'not-a-date');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid end date format');
    });

    it('should return invalid when end date is in the future', () => {
      // Mock a date far in the future
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const result = validateDateRange('2025-11-01', futureDateStr);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('End date cannot be in the future');
    });

    it('should handle dates across year boundary', () => {
      const result = validateDateRange('2024-12-15', '2025-01-15');
      expect(result.valid).toBe(true);
    });

    it('should handle leap year dates correctly', () => {
      const result = validateDateRange('2024-02-01', '2024-02-29');
      expect(result.valid).toBe(true);
    });

    it('should reject empty strings', () => {
      const result = validateDateRange('', '2025-11-15');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid start date format');
    });

    it('should reject malformed ISO dates', () => {
      const result = validateDateRange('2025-11-1', '2025-11-15');
      expect(result.valid).toBe(false);
    });
  });
});
