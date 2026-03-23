import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { plugin as markdown, Mode } from "vite-plugin-markdown";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [tailwindcss(), reactRouter(), markdown({ mode: [Mode.HTML] })],
  define: {
    "process.env.ENABLED_FEATURES": JSON.stringify(
      process.env.ENABLED_FEATURES,
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
