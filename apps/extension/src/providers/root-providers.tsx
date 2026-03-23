import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SyncedStorageProvider } from "synced-storage/react";
import Toaster from "@workspace/ui/primitives/toaster";
import { NostrConfigProvider } from "@workspace/ui/comment/context";
import ExtensionWalletProvider from "@/providers/wallet-extension-provider";
import { ENV } from "@/configs/env";

const queryClient = new QueryClient();

const nostrConfig = {
  relays: ENV.NOSTR_RELAYS,
  topicPrefix: ENV.NOSTR_TOPIC_PREFIX,
};

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <SyncedStorageProvider>
      <QueryClientProvider client={queryClient}>
        <ExtensionWalletProvider>
          <NostrConfigProvider value={nostrConfig}>
            {children}
            <Toaster />
          </NostrConfigProvider>
        </ExtensionWalletProvider>
      </QueryClientProvider>
    </SyncedStorageProvider>
  );
}
