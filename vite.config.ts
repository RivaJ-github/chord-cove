import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { alphaTab } from "@coderline/alphatab/vite";
import path from "path";
import { fileURLToPath } from "url";
import WindiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    WindiCSS(),
    alphaTab({
      alphaTabSourceDir: path.resolve(
        "./node_modules/@coderline/alphatab/dist"
      ),
      assetOutputDir:
        command === "serve"
          ? path.resolve("./node_modules/.vite/deps/") // 开发环境
          : path.resolve("./public/assets"),
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3002/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
}));
