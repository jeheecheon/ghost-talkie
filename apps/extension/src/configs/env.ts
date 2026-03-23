export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
  NOTIFICATION_SOUND_URL:
    process.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
  NOSTR_TOPIC_PREFIX: process.env.TOPIC_PREFIX ?? "ghosttalkie",
  NOSTR_RELAYS: process.env.RELAYS?.split(",") ?? [
    "wss://relay.damus.io",
    "wss://nos.lol",
  ],
} as const;
