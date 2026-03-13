import base from "@workspace/eslint-config/base";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.ts"],
    extends: [...base],
  },
]);
