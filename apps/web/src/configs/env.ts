export const ENV = {
  IS_PRODUCTION: import.meta.env.PROD,
  NOSTR_TOPIC_PREFIX: import.meta.env.VITE_TOPIC_PREFIX ?? "ghosttalkie",
  NOSTR_RELAYS: import.meta.env.VITE_RELAYS?.split(",") ?? [
    "wss://relay.damus.io",
    "wss://nos.lol",
  ],
} as const;
