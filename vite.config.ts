import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    outDir: "./wwwroot",
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      external: [/^@umbraco-cms/],
      onwarn: () => {},
      output: {
        chunkFileNames: "[name].js",
        manualChunks: {
          chartjs: ["chart.js"],
          humanize: ["humanize-duration"],
        },
      },
    },
  },
  plugins: [tsconfigPaths()],
});
