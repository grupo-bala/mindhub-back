import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    coverage: {
      reportOnFailure: true,
    }
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});