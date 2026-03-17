import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Toaster from "@workspace/ui/primitives/toaster";
import { NostrConfigProvider } from "@workspace/ui/comment/context";
import { config } from "@workspace/ui/wallet/configs/wagmi";
import { env } from "@/configs/env";

const queryClient = new QueryClient();

const nostrConfig = {
  relays: env.nostrRelays,
  topicPrefix: env.nostrTopicPrefix,
};

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NostrConfigProvider value={nostrConfig}>
          {children}
          <Toaster />
        </NostrConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
