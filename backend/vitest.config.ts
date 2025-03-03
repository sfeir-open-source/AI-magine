import { defineConfig } from 'vitest/config';
import * as path from 'node:path';

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
      EMAIL_HASH_SECRET: 'Y3e$$F5thgw9y!u*MJzp@86arQ8cAD&S',
      SQLITE_DB_PATH: ':memory:',
    },
  },
});
