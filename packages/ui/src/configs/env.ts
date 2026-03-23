export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
  NOTIFICATION_SOUND_URL:
    process.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
} as const;
