import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  // 🚀 Remove all console.* and debugger statements in production build
  esbuild: {
    drop: ["console", "debugger"],
  },
});
