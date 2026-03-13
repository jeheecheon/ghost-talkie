import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...base,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  {
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
