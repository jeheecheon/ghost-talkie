import { ensure } from "@workspace/lib/assert";

export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
  REOWN_PROJECT_ID: ensure(process.env.REOWN_PROJECT_ID),
  NOTIFICATION_SOUND_URL:
    process.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
} as const;
