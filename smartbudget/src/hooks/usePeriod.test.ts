/**
 * usePeriod Hook Tests
 *
 * Tests for the usePeriod custom hook.
 * Target coverage: ≥90%
 *
 * @module hooks/usePeriod.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePeriod } from './usePeriod';
import type { Period } from '../models/Period';

// Mock the AppContext
const mockUseAppContext = vi.fn();
vi.mock('../context/AppContext', () => ({
  useAppContext: () => mockUseAppContext(),
}));

// Mock getAllPresetPeriods
const mockGetAllPresetPeriods = vi.fn();
vi.mock('../utils/periodHelpers', () => ({
  getAllPresetPeriods: () => mockGetAllPresetPeriods(),
}));

describe('usePeriod', () => {
  const mockSetPeriod = vi.fn();

  const mockPresetPeriods: Period[] = [
    {
      type: 'this-month',
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      label: 'This Month',
    },
    {
      type: 'last-month',
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      label: 'Last Month',
    },
    {
      type: 'last-3-months',
      startDate: '2025-08-01',
      endDate: '2025-11-15',
      label: 'Last 3 Months',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPresetPeriods.mockReturnValue(mockPresetPeriods);
  });

  it('returns selectedPeriod from context', () => {
    const selectedPeriod: Period = {
      type: 'this-month',
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      label: 'This Month',
    };

    mockUseAppContext.mockReturnValue({
      selectedPeriod,
      setPeriod: mockSetPeriod,
    });

    const { result } = renderHook(() => usePeriod());

    expect(result.current.selectedPeriod).toEqual(selectedPeriod);
  });

  it('returns setPeriod function from context', () => {
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[0],
      setPeriod: mockSetPeriod,
    });

    const { result } = renderHook(() => usePeriod());

    expect(result.current.setPeriod).toBe(mockSetPeriod);
    expect(typeof result.current.setPeriod).toBe('function');
  });

  it('returns periodOptions array with all preset periods', () => {
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[0],
      setPeriod: mockSetPeriod,
    });

    const { result } = renderHook(() => usePeriod());

    expect(result.current.periodOptions).toEqual(mockPresetPeriods);
    expect(result.current.periodOptions).toHaveLength(3);
  });

  it('returns periodOptions with correct period types', () => {
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[0],
      setPeriod: mockSetPeriod,
    });

    const { result } = renderHook(() => usePeriod());

    expect(result.current.periodOptions[0].type).toBe('this-month');
    expect(result.current.periodOptions[1].type).toBe('last-month');
    expect(result.current.periodOptions[2].type).toBe('last-3-months');
  });

  describe('isCustomPeriod', () => {
    it('returns false when selectedPeriod type is not custom', () => {
      mockUseAppContext.mockReturnValue({
        selectedPeriod: mockPresetPeriods[0], // type: 'this-month'
        setPeriod: mockSetPeriod,
      });

      const { result } = renderHook(() => usePeriod());

      expect(result.current.isCustomPeriod).toBe(false);
    });

    it('returns true when selectedPeriod type is custom', () => {
      const customPeriod: Period = {
        type: 'custom',
        startDate: '2025-11-01',
        endDate: '2025-11-15',
        label: 'Nov 1 - Nov 15, 2025',
      };

      mockUseAppContext.mockReturnValue({
        selectedPeriod: customPeriod,
        setPeriod: mockSetPeriod,
      });

      const { result } = renderHook(() => usePeriod());

      expect(result.current.isCustomPeriod).toBe(true);
    });

    it('returns false for this-month period', () => {
      mockUseAppContext.mockReturnValue({
        selectedPeriod: mockPresetPeriods[0],
        setPeriod: mockSetPeriod,
      });

      const { result } = renderHook(() => usePeriod());

      expect(result.current.isCustomPeriod).toBe(false);
    });

    it('returns false for last-month period', () => {
      mockUseAppContext.mockReturnValue({
        selectedPeriod: mockPresetPeriods[1],
        setPeriod: mockSetPeriod,
      });

      const { result } = renderHook(() => usePeriod());

      expect(result.current.isCustomPeriod).toBe(false);
    });

    it('returns false for last-3-months period', () => {
      mockUseAppContext.mockReturnValue({
        selectedPeriod: mockPresetPeriods[2],
        setPeriod: mockSetPeriod,
      });

      const { result } = renderHook(() => usePeriod());

      expect(result.current.isCustomPeriod).toBe(false);
    });
  });

  it('returns all required fields in UsePeriodReturn interface', () => {
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[0],
      setPeriod: mockSetPeriod,
    });

    const { result } = renderHook(() => usePeriod());

    expect(result.current).toHaveProperty('selectedPeriod');
    expect(result.current).toHaveProperty('setPeriod');
    expect(result.current).toHaveProperty('periodOptions');
    expect(result.current).toHaveProperty('isCustomPeriod');
  });

  it('hook updates when context changes', () => {
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[0],
      setPeriod: mockSetPeriod,
    });

    const { result, rerender } = renderHook(() => usePeriod());

    expect(result.current.selectedPeriod.type).toBe('this-month');

    // Update context
    mockUseAppContext.mockReturnValue({
      selectedPeriod: mockPresetPeriods[1], // Change to last-month
      setPeriod: mockSetPeriod,
    });

    rerender();

    expect(result.current.selectedPeriod.type).toBe('last-month');
  });
});
