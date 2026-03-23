export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
  NOTIFICATION_SOUND_URL:
    process.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
  PRIVACY_POLICY_URL:
    process.env.PRIVACY_POLICY_URL ??
    "https://jeheecheon.github.io/ghost-talkie/privacy-policy",
} as const;
