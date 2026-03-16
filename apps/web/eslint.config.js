import react from "@workspace/eslint-config/react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", ".react-router"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...react],
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { prefix: "@", rootDir: "src" },
      ],
    },
  },
]);
