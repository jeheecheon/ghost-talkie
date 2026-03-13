import { createContext, useContext } from "react";
import type { NostrConfig } from "@workspace/domain/nostr/types";
import { assert } from "@workspace/lib/assert";

const NostrConfigContext = createContext<NostrConfig | null>(null);

export const NostrConfigProvider = NostrConfigContext.Provider;

export function useNostrConfig(): NostrConfig {
  const config = useContext(NostrConfigContext);
  assert(config, "NostrConfigProvider is required");
  return config;
}
