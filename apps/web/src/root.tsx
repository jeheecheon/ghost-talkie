import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { NostrConfigProvider } from "@workspace/ui/comment/context";
import { Layout } from "@/layout";
import HydrateFallback from "@/hydrate-fallback";
import ErrorBoundary from "@/error-boundary";
import { config } from "@/configs/wagmi";
import { env } from "@/configs/env";
import "@/globals.css";

export { Layout, HydrateFallback, ErrorBoundary };

const queryClient = new QueryClient();

const nostrConfig = {
  relays: env.nostrRelays,
  topicPrefix: env.nostrTopicPrefix,
};

function Root() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NostrConfigProvider value={nostrConfig}>
          <Outlet />
        </NostrConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Root;
