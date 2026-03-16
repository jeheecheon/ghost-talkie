import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "GhostTalkie",
    description: "P2P chat with Web3 wallet identity",
    permissions: ["sidePanel", "activeTab", "storage"],
  },
});
