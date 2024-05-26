import { defineConfig } from "vite";
import { outputPath } from "./config.outputPath.js";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    outDir: outputPath,
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      external: [/^@umbraco-cms/],
      onwarn: () => {},
      output: {
        chunkFileNames: "[name].js",
      },
    },
  },
  plugins: [tsconfigPaths()],
});
