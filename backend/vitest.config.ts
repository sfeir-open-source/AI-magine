import { defineConfig } from 'vitest/config';
import * as path from 'node:path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, './.env.test') });

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['json', 'html'],
    },
  },
});
