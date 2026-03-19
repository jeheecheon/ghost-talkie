import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SyncedStorageProvider } from "synced-storage/react";
import Toaster from "@workspace/ui/primitives/toaster";
import { NostrConfigProvider } from "@workspace/ui/comment/context";
import { wagmiAdapter } from "@workspace/ui/wallet/configs/appkit";
import { ENV } from "@/configs/env";

const queryClient = new QueryClient();

const nostrConfig = {
  relays: ENV.NOSTR_RELAYS,
  topicPrefix: ENV.NOSTR_TOPIC_PREFIX,
};

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SyncedStorageProvider>
          <NostrConfigProvider value={nostrConfig}>
            {children}
            <Toaster />
          </NostrConfigProvider>
        </SyncedStorageProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
