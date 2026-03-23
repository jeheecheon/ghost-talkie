import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SyncedStorageProvider } from "synced-storage/react";
import Toaster from "@workspace/ui/primitives/toaster";
import { NostrConfigProvider } from "@workspace/ui/comment/context";
import { wagmiConfig } from "@workspace/ui/wallet/configs/wagmi";
import InjectedWalletProvider from "@workspace/ui/wallet/context/injected-wallet-provider";
import WalletSelectDialogProvider from "@workspace/ui/wallet/context/wallet-select-dialog-provider";
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
        <WagmiProvider config={wagmiConfig}>
          <NostrConfigProvider value={nostrConfig}>
            <InjectedWalletProvider>
              <WalletSelectDialogProvider>
                {children}
                <Toaster />
              </WalletSelectDialogProvider>
            </InjectedWalletProvider>
          </NostrConfigProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </SyncedStorageProvider>
  );
}
