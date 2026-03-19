import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REOWN_PROJECT_ID) {
  throw new Error("REOWN_PROJECT_ID is not set");
}

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [tailwindcss(), reactRouter()],
  define: {
    "process.env.ENABLED_FEATURES": JSON.stringify(
      process.env.ENABLED_FEATURES,
    ),
    "process.env.REOWN_PROJECT_ID": JSON.stringify(
      process.env.REOWN_PROJECT_ID,
    ),
    "process.env.NOTIFICATION_SOUND_URL": JSON.stringify(
      process.env.NOTIFICATION_SOUND_URL,
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["wagmi", "@tanstack/react-query", "react", "react-dom", "viem"],
  },
});
