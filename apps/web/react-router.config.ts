import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  basename: process.env.BASE_PATH || "/",
  ssr: false,
  async prerender() {
    return ["/", "/chat"];
  },
} satisfies Config;
