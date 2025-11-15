/**
 * usePeriod Custom Hook
 *
 * Provides period management functionality for components.
 * Abstracts period state access and provides preset period options.
 *
 * @module hooks/usePeriod
 */

import { useAppContext } from '../context/AppContext';
import { getAllPresetPeriods } from '../utils/periodHelpers';
import type { Period } from '../models/Period';

/**
 * usePeriod hook return type
 *
 * Provides all period-related state and actions
 */
export interface UsePeriodReturn {
  /**
   * Currently selected period
   */
  selectedPeriod: Period;

  /**
   * Function to update the selected period
   * Persists to localStorage automatically via AppContext
   */
  setPeriod: (period: Period) => void;

  /**
   * Array of all preset period options (This Month, Last Month, Last 3 Months)
   */
  periodOptions: Period[];

  /**
   * Boolean indicating if the current period is a custom period
   * True when selectedPeriod.type === 'custom'
   */
  isCustomPeriod: boolean;
}

/**
 * Custom hook for period management
 *
 * Provides access to the selected period, period setter, preset periods,
 * and custom period indicator. Consumes AppContext for global period state.
 *
 * @returns Period state and actions
 *
 * @example
 * const { selectedPeriod, setPeriod, periodOptions, isCustomPeriod } = usePeriod();
 *
 * // Change to last month
 * const lastMonth = periodOptions.find(p => p.type === 'last-month');
 * if (lastMonth) setPeriod(lastMonth);
 *
 * // Check if custom period
 * if (isCustomPeriod) {
 *   console.log('User selected custom date range');
 * }
 */
export const usePeriod = (): UsePeriodReturn => {
  const { selectedPeriod, setPeriod } = useAppContext();

  // Get all preset period options (This Month, Last Month, Last 3 Months)
  const periodOptions = getAllPresetPeriods();

  // Check if current period is a custom period
  const isCustomPeriod = selectedPeriod.type === 'custom';

  return {
    selectedPeriod,
    setPeriod,
    periodOptions,
    isCustomPeriod,
  };
};
