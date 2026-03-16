import react from "@workspace/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...react],
  },
]);
