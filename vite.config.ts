import { defineConfig } from "vite";

export default defineConfig({
  // Set base to './' so that assets are loaded correctly relative to index.html
  // This is the most compatible way for GitHub Pages.
  base: "./",
});
