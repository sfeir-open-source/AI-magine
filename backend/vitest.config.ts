import { defineConfig } from 'vitest/config';
import * as path from 'node:path';
import { config } from 'dotenv';
import * as process from 'node:process';

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
    env: {
      ...process.env,
      EMAIL_HASH_SECRET: 'X5EoRg!Fgqpwbik2a&b6yki48VQgyiCt',
      SQLITE_DB_PATH: ':memory:',
    },
  },
});
