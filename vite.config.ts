import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// Plugin to make CSS async (non-render-blocking)
const asyncCssPlugin = () => ({
  name: 'async-css',
  transformIndexHtml(html: string) {
    // Replace render-blocking stylesheet links with async preload
    return html.replace(
      /<link rel="stylesheet" crossorigin href="([^"]+)"\s*\/?>/g,
      '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'" />\n    <noscript><link rel="stylesheet" href="$1" /></noscript>'
    );
  },
});

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), asyncCssPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
