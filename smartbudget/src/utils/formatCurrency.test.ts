/**
 * formatCurrency Utility Tests
 *
 * Tests for currency formatting utility.
 * Ensures consistent USD formatting across the application.
 *
 * @module utils/formatCurrency.test
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats positive amounts with dollar sign and decimals', () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe('$1,234.56');
  });

  it('formats zero as $0.00', () => {
    const result = formatCurrency(0);
    expect(result).toBe('$0.00');
  });

  it('formats negative amounts with minus sign', () => {
    const result = formatCurrency(-123.45);
    expect(result).toBe('-$123.45');
  });

  it('formats large amounts with commas', () => {
    const result = formatCurrency(1000000);
    expect(result).toBe('$1,000,000.00');
  });

  it('formats amounts with trailing zero', () => {
    const result = formatCurrency(10.1);
    expect(result).toBe('$10.10');
  });

  it('rounds fractional cents correctly (round up)', () => {
    const result = formatCurrency(10.999);
    expect(result).toBe('$11.00');
  });

  it('rounds fractional cents correctly (round down)', () => {
    const result = formatCurrency(10.001);
    expect(result).toBe('$10.00');
  });

  it('formats very large amounts', () => {
    const result = formatCurrency(1234567.89);
    expect(result).toBe('$1,234,567.89');
  });

  it('formats amounts with no fractional part', () => {
    const result = formatCurrency(100);
    expect(result).toBe('$100.00');
  });

  it('formats small amounts correctly', () => {
    const result = formatCurrency(0.99);
    expect(result).toBe('$0.99');
  });

  it('formats negative large amounts', () => {
    const result = formatCurrency(-5000);
    expect(result).toBe('-$5,000.00');
  });

  it('formats amounts with exactly 2 decimals', () => {
    const result = formatCurrency(99.99);
    expect(result).toBe('$99.99');
  });
});
