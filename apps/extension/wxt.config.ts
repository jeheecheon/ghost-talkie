import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "GhostTalkie",
    description: "P2P chat with Web3 wallet identity",
    permissions: ["activeTab", "storage", "tabs"],
    icons: {
      "16": "icon-16.png",
      "32": "icon-32.png",
      "48": "icon-48.png",
      "128": "icon-128.png",
    },
  },
  vite: () => ({
    // @tailwindcss/vite ships Vite 7 types; WXT expects Vite 6
    plugins: [tailwindcss() as any],
    define: {
      "process.env.ENABLED_FEATURES": JSON.stringify(
        process.env.ENABLED_FEATURES,
      ),
      "process.env.NOTIFICATION_SOUND_URL": JSON.stringify(
        process.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["wagmi", "@tanstack/react-query", "react", "react-dom", "viem"],
    },
  }),
});
