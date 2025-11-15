/**
 * Period Helpers Tests
 *
 * Tests for period calculation utilities.
 * Uses mocked dates for consistent testing.
 *
 * @module utils/periodHelpers.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getThisMonth,
  getLastMonth,
  getLast3Months,
  formatCustomLabel,
  getAllPresetPeriods,
} from './periodHelpers';

describe('periodHelpers', () => {
  // Mock a fixed date: November 15, 2025
  const mockDate = new Date('2025-11-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getThisMonth', () => {
    it('returns period with type "this-month"', () => {
      const result = getThisMonth();
      expect(result.type).toBe('this-month');
    });

    it('returns correct start date (first day of current month)', () => {
      const result = getThisMonth();
      expect(result.startDate).toBe('2025-11-01');
    });

    it('returns correct end date (last day of current month)', () => {
      const result = getThisMonth();
      expect(result.endDate).toBe('2025-11-30');
    });

    it('returns label "This Month"', () => {
      const result = getThisMonth();
      expect(result.label).toBe('This Month');
    });

    it('handles month with 31 days correctly', () => {
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
      const result = getThisMonth();
      expect(result.startDate).toBe('2025-01-01');
      expect(result.endDate).toBe('2025-01-31');
    });

    it('handles February in non-leap year', () => {
      vi.setSystemTime(new Date('2025-02-15T12:00:00Z'));
      const result = getThisMonth();
      expect(result.startDate).toBe('2025-02-01');
      expect(result.endDate).toBe('2025-02-28');
    });

    it('handles February in leap year', () => {
      vi.setSystemTime(new Date('2024-02-15T12:00:00Z'));
      const result = getThisMonth();
      expect(result.startDate).toBe('2024-02-01');
      expect(result.endDate).toBe('2024-02-29');
    });
  });

  describe('getLastMonth', () => {
    it('returns period with type "last-month"', () => {
      const result = getLastMonth();
      expect(result.type).toBe('last-month');
    });

    it('returns correct start date (first day of previous month)', () => {
      const result = getLastMonth();
      // November 15, 2025 -> Last month is October 2025
      expect(result.startDate).toBe('2025-10-01');
    });

    it('returns correct end date (last day of previous month)', () => {
      const result = getLastMonth();
      expect(result.endDate).toBe('2025-10-31');
    });

    it('returns label "Last Month"', () => {
      const result = getLastMonth();
      expect(result.label).toBe('Last Month');
    });

    it('handles year boundary correctly', () => {
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
      const result = getLastMonth();
      // January 2025 -> Last month is December 2024
      expect(result.startDate).toBe('2024-12-01');
      expect(result.endDate).toBe('2024-12-31');
    });

    it('handles February to January transition', () => {
      vi.setSystemTime(new Date('2025-03-15T12:00:00Z'));
      const result = getLastMonth();
      // March -> Last month is February 2025
      expect(result.startDate).toBe('2025-02-01');
      expect(result.endDate).toBe('2025-02-28');
    });
  });

  describe('getLast3Months', () => {
    it('returns period with type "last-3-months"', () => {
      const result = getLast3Months();
      expect(result.type).toBe('last-3-months');
    });

    it('returns start date 3 months ago from first day of that month', () => {
      const result = getLast3Months();
      // November 15, 2025 - 3 months = August 15, 2025 -> First day of August
      expect(result.startDate).toBe('2025-08-01');
    });

    it('returns end date as today', () => {
      const result = getLast3Months();
      expect(result.endDate).toBe('2025-11-15');
    });

    it('returns label "Last 3 Months"', () => {
      const result = getLast3Months();
      expect(result.label).toBe('Last 3 Months');
    });

    it('handles year boundary correctly', () => {
      vi.setSystemTime(new Date('2025-02-15T12:00:00Z'));
      const result = getLast3Months();
      // February 15, 2025 - 3 months = November 15, 2024 -> First day of November
      expect(result.startDate).toBe('2024-11-01');
      expect(result.endDate).toBe('2025-02-15');
    });
  });

  describe('formatCustomLabel', () => {
    it('formats dates within same month correctly', () => {
      const result = formatCustomLabel('2025-11-01', '2025-11-15');
      expect(result).toBe('Nov 1-15, 2025');
    });

    it('formats dates across different months correctly', () => {
      const result = formatCustomLabel('2025-11-01', '2025-12-15');
      expect(result).toBe('Nov 1 - Dec 15, 2025');
    });

    it('formats dates across year boundary correctly', () => {
      const result = formatCustomLabel('2024-12-15', '2025-01-15');
      // Year from end date
      expect(result).toBe('Dec 15 - Jan 15, 2025');
    });

    it('handles single-day range correctly', () => {
      const result = formatCustomLabel('2025-11-15', '2025-11-15');
      expect(result).toBe('Nov 15-15, 2025');
    });

    it('formats first and last day of month correctly', () => {
      const result = formatCustomLabel('2025-11-01', '2025-11-30');
      expect(result).toBe('Nov 1-30, 2025');
    });
  });

  describe('getAllPresetPeriods', () => {
    it('returns array with 3 periods', () => {
      const result = getAllPresetPeriods();
      expect(result).toHaveLength(3);
    });

    it('returns This Month as first period', () => {
      const result = getAllPresetPeriods();
      expect(result[0].type).toBe('this-month');
      expect(result[0].label).toBe('This Month');
    });

    it('returns Last Month as second period', () => {
      const result = getAllPresetPeriods();
      expect(result[1].type).toBe('last-month');
      expect(result[1].label).toBe('Last Month');
    });

    it('returns Last 3 Months as third period', () => {
      const result = getAllPresetPeriods();
      expect(result[2].type).toBe('last-3-months');
      expect(result[2].label).toBe('Last 3 Months');
    });

    it('all periods have required fields', () => {
      const result = getAllPresetPeriods();
      result.forEach(period => {
        expect(period).toHaveProperty('type');
        expect(period).toHaveProperty('startDate');
        expect(period).toHaveProperty('endDate');
        expect(period).toHaveProperty('label');
      });
    });

    it('all periods have valid ISO date format', () => {
      const result = getAllPresetPeriods();
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
      result.forEach(period => {
        expect(period.startDate).toMatch(isoDatePattern);
        expect(period.endDate).toMatch(isoDatePattern);
      });
    });
  });
});
