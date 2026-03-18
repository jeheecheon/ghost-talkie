import { ensure } from "@workspace/lib/assert";

export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
  REOWN_PROJECT_ID: ensure(process.env.REOWN_PROJECT_ID),
} as const;
