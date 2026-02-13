/**
 * Vitest Configuration
 *
 * Test configuration with coverage reporting
 * @version 1.0.0
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types.ts',
        '**/index.ts',
        'test/',
        'tests/',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['node_modules/', 'dist/'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@toon': resolve(__dirname, './src/toon'),
      '@templates': resolve(__dirname, './src/templates'),
      '@commands': resolve(__dirname, './src/commands'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
});
