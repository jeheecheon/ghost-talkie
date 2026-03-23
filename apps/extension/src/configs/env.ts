const DEFAULT_MARKETPLACE_MATCH_PATTERNS = [
  "https://opensea.io/*",
  "https://*.opensea.io/*",
  "https://blur.io/*",
  "https://*.blur.io/*",
  "https://crossnft.io/*",
  "https://*.crossnft.io/*",
];

export const ENV = {
  ENABLED_FEATURES: (import.meta.env.ENABLED_FEATURES ?? "").split(","),
  NOTIFICATION_SOUND_URL:
    import.meta.env.NOTIFICATION_SOUND_URL ?? "/sounds/ghost-cute.wav",
  NOSTR_TOPIC_PREFIX: import.meta.env.TOPIC_PREFIX ?? "ghosttalkie",
  NOSTR_RELAYS: import.meta.env.RELAYS?.split(",") ?? [
    "wss://relay.damus.io",
    "wss://nos.lol",
  ],
  MARKETPLACE_MATCH_PATTERNS:
    import.meta.env.MARKETPLACE_MATCH_PATTERNS?.split(",") ??
    DEFAULT_MARKETPLACE_MATCH_PATTERNS,
} as const;
