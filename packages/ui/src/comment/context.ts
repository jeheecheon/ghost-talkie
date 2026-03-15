import { createContext, useContext } from "react";
import type { NostrConfig } from "@workspace/domain/nostr/types";
import { assert } from "@workspace/lib/assert";
import type { Nullable } from "@workspace/types/misc";

const NostrConfigContext = createContext<Nullable<NostrConfig>>(null);

export const NostrConfigProvider = NostrConfigContext.Provider;

export function useNostrConfig(): NostrConfig {
  const config = useContext(NostrConfigContext);
  assert(config, "NostrConfigProvider is required");
  return config;
}
