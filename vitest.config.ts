import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals:     true,
    environment: "node",
    setupFiles:  ["./tests/setup.ts"],
    coverage: {
      provider:   "v8",
      reporter:   ["text", "html", "lcov"],
      include:    ["src/**/*.ts", "src/**/*.tsx"],
      exclude:    ["src/**/*.test.*", "src/app/api/**"],
      thresholds: {
        statements: 70,
        branches:   60,
        functions:  70,
        lines:      70,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
