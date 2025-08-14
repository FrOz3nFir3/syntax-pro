import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
  },
  build: {
    // Enable chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
