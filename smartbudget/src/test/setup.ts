/**
 * Vitest Test Setup
 *
 * Global test configuration and setup for the Smart Budget Application.
 * Configures jsdom environment and testing library matchers.
 *
 * @module test/setup
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
