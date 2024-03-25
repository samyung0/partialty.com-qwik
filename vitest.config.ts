import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    setupFiles: ["./setup/setup.unit.ts"],
    environment: "happy-dom",
    include: ["./vitest/**/*.test.{js,ts,jsx,tsx}"],
    exclude: ["./vitest/integration/*.test.{js,jsx,ts,tsx}"],
    reporters: process.env.GITHUB_ACTIONS ? ["verbose", "github-actions"] : ["verbose"],
  },
});
