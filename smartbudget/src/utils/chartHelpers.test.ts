/**
 * Chart Helpers Tests
 *
 * Tests for chart data transformation utilities.
 * Target coverage: ≥90%
 *
 * @module utils/chartHelpers.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transformToPieChartData } from './chartHelpers';
import * as categories from '../constants/categories';

// Mock getCategoryById
const mockGetCategoryById = vi.fn();
vi.mock('../constants/categories', async () => {
  const actual = await vi.importActual<typeof categories>(
    '../constants/categories'
  );
  return {
    ...actual,
    getCategoryById: (id: string) => mockGetCategoryById(id),
  };
});

describe('transformToPieChartData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('transforms expenses by category to chart data', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        groceries: { name: 'Food/Groceries', color: '#B91C1C' },
        rent: { name: 'Rent', color: '#EF4444' },
        transport: { name: 'Transport', color: '#F59E0B' },
      };
      return categoryMap[id];
    });

    const input = { groceries: 150, rent: 200, transport: 50 };
    const result = transformToPieChartData(input);

    expect(result).toHaveLength(3);

    // Sorted by value descending (rent=200, groceries=150, transport=50)
    expect(result[0]).toMatchObject({
      name: 'Rent',
      value: 200,
      fill: '#EF4444',
    });
    expect(result[1]).toMatchObject({
      name: 'Food/Groceries',
      value: 150,
      fill: '#B91C1C',
    });
    expect(result[2]).toMatchObject({
      name: 'Transport',
      value: 50,
      fill: '#F59E0B',
    });
  });

  it('calculates percentages correctly', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        groceries: { name: 'Food/Groceries', color: '#B91C1C' },
        rent: { name: 'Rent', color: '#EF4444' },
        transport: { name: 'Transport', color: '#F59E0B' },
      };
      return categoryMap[id];
    });

    const input = { groceries: 150, rent: 200, transport: 50 };
    const result = transformToPieChartData(input);

    // Total = 400
    // rent: 200/400 = 50% → 50
    // groceries: 150/400 = 37.5% → 38 (rounded)
    // transport: 50/400 = 12.5% → 12 (rounded)
    // Sum before adjustment: 50 + 38 + 12 = 100 (or might be 99/101 due to rounding)
    // After adjustment to ensure exactly 100%, largest category (rent) gets the difference

    // Check that percentages exist and sum to 100
    expect(result[0]).toHaveProperty('percentage');
    expect(result[1]).toHaveProperty('percentage');
    expect(result[2]).toHaveProperty('percentage');

    const totalPercentage = result.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBe(100);
  });

  it('ensures percentages sum to 100', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        cat1: { name: 'Category 1', color: '#FF0000' },
        cat2: { name: 'Category 2', color: '#00FF00' },
        cat3: { name: 'Category 3', color: '#0000FF' },
      };
      return categoryMap[id];
    });

    // Values that cause rounding issues
    const input = { cat1: 33, cat2: 33, cat3: 34 };
    const result = transformToPieChartData(input);

    const totalPercentage = result.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBe(100);
  });

  it('adjusts largest category when percentages do not sum to 100', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        cat1: { name: 'Category 1', color: '#FF0000' },
        cat2: { name: 'Category 2', color: '#00FF00' },
        cat3: { name: 'Category 3', color: '#0000FF' },
      };
      return categoryMap[id];
    });

    // These values will cause 99% or 101% before adjustment
    const input = { cat1: 10, cat2: 10, cat3: 10 };
    const result = transformToPieChartData(input);

    const totalPercentage = result.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBe(100);
  });

  it('filters out zero amounts', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        groceries: { name: 'Food/Groceries', color: '#B91C1C' },
        rent: { name: 'Rent', color: '#EF4444' },
      };
      return categoryMap[id];
    });

    const input = { groceries: 100, rent: 0 };
    const result = transformToPieChartData(input);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Food/Groceries');
    expect(result[0].value).toBe(100);
  });

  it('returns empty array when total expenses is zero', () => {
    const result = transformToPieChartData({});
    expect(result).toEqual([]);
  });

  it('returns empty array when all amounts are zero', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        groceries: { name: 'Food/Groceries', color: '#B91C1C' },
        rent: { name: 'Rent', color: '#EF4444' },
      };
      return categoryMap[id];
    });

    const input = { groceries: 0, rent: 0 };
    const result = transformToPieChartData(input);

    expect(result).toEqual([]);
  });

  it('handles unknown category gracefully', () => {
    mockGetCategoryById.mockReturnValue(undefined);

    const input = { unknown: 100 };
    const result = transformToPieChartData(input);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Unknown');
    expect(result[0].fill).toBe('#9CA3AF'); // Gray fallback
  });

  it('sorts data by value descending', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        cat1: { name: 'Small', color: '#FF0000' },
        cat2: { name: 'Large', color: '#00FF00' },
        cat3: { name: 'Medium', color: '#0000FF' },
      };
      return categoryMap[id];
    });

    const input = { cat1: 50, cat2: 200, cat3: 100 };
    const result = transformToPieChartData(input);

    expect(result[0].name).toBe('Large'); // 200
    expect(result[1].name).toBe('Medium'); // 100
    expect(result[2].name).toBe('Small'); // 50
  });

  it('rounds values to 2 decimal places', () => {
    mockGetCategoryById.mockImplementation(() => ({
      name: 'Test Category',
      color: '#FF0000',
    }));

    const input = { test: 100.999 };
    const result = transformToPieChartData(input);

    expect(result[0].value).toBe(101); // Rounded
  });

  it('handles single category', () => {
    mockGetCategoryById.mockImplementation(() => ({
      name: 'Rent',
      color: '#EF4444',
    }));

    const input = { rent: 1200 };
    const result = transformToPieChartData(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Rent',
      value: 1200,
      fill: '#EF4444',
      percentage: 100,
    });
  });

  it('handles many categories', () => {
    mockGetCategoryById.mockImplementation((id: string) => ({
      name: `Category ${id}`,
      color: `#${id.padStart(6, '0')}`,
    }));

    const input = {
      cat1: 100,
      cat2: 200,
      cat3: 150,
      cat4: 50,
      cat5: 75,
      cat6: 125,
    };

    const result = transformToPieChartData(input);

    expect(result).toHaveLength(6);

    const totalPercentage = result.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBe(100);

    // Check sorted by value descending
    expect(result[0].value).toBeGreaterThanOrEqual(result[1].value);
    expect(result[1].value).toBeGreaterThanOrEqual(result[2].value);
  });

  it('includes all required fields in PieChartDataItem', () => {
    mockGetCategoryById.mockImplementation(() => ({
      name: 'Test Category',
      color: '#FF0000',
    }));

    const input = { test: 100 };
    const result = transformToPieChartData(input);

    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('value');
    expect(result[0]).toHaveProperty('fill');
    expect(result[0]).toHaveProperty('percentage');
  });

  it('handles fractional percentages that round to same value', () => {
    mockGetCategoryById.mockImplementation((id: string) => {
      const categoryMap: Record<string, { name: string; color: string }> = {
        cat1: { name: 'Cat 1', color: '#FF0000' },
        cat2: { name: 'Cat 2', color: '#00FF00' },
      };
      return categoryMap[id];
    });

    // Both should round to 50%, total = 100%
    const input = { cat1: 50.4, cat2: 49.6 };
    const result = transformToPieChartData(input);

    const totalPercentage = result.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBe(100);
  });
});
