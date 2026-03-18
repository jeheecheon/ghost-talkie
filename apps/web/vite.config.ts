import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  define: {
    "process.env.ENABLED_FEATURES": JSON.stringify(
      process.env.ENABLED_FEATURES ?? "",
    ),
    "process.env.REOWN_PROJECT_ID": JSON.stringify(
      process.env.REOWN_PROJECT_ID ?? "",
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
