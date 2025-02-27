import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins = [];
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}] as [string, Record<string, any>]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react({
      plugins: [...conditionalPlugins],
    }),
    // Chỉ sử dụng tempo trong môi trường development
    process.env.NODE_ENV !== "production" ? tempo() : null,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    headers: {
      "Content-Type": "text/javascript",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
});
