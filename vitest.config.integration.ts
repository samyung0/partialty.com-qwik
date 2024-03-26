import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    include: ['./vitest/integration/*.test.{js,ts,jsx,tsx}'],
    setupFiles: ['./setup/setup.unit.integration.ts'],
    reporters: process.env.GITHUB_ACTIONS ? ['verbose', 'github-actions'] : ['verbose'],
  },
});
