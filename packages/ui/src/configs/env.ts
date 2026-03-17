export const ENV = {
  ENABLED_FEATURES: (process.env.ENABLED_FEATURES ?? "").split(","),
} as const;
