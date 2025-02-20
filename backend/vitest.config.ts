import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
    include: ['src/**/*.spec.ts'],
		passWithNoTests: true,
		coverage: {
			provider: "v8",
			reporter: ["json", "html"]
		}
	},
});
