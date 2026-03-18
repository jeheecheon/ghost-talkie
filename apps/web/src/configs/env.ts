export const env = {
  isProduction: import.meta.env.PROD,
  nostrTopicPrefix: import.meta.env.VITE_TOPIC_PREFIX ?? "ghosttalkie",
  nostrRelays: import.meta.env.VITE_RELAYS?.split(",") ?? [
    "wss://relay.damus.io",
    "wss://nos.lol",
  ],
} as const;
