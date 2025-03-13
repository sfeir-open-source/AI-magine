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
      EMAIL_ENCRYPTION_KEY:
        '24a387402a0ba46cc561179b103a08a5debc701dfab6ba0f24d3e9c40bd61f1d',
      EMAIL_ENCRYPTION_IV: '726c2b9ff0d5643bbe0b167a13e2366f',
      SQLITE_DB_PATH: ':memory:',
    },
  },
});
