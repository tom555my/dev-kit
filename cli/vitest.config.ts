import { defineConfig } from 'vitest/config';
import Raw from 'unplugin-raw/vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 10000, // 10 second timeout for tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'lcovonly'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts', '**/*.config.ts'],
      // Set 80% minimum coverage threshold
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  plugins: [Raw()],
});
