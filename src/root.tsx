import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Layout } from "@/layouts/RootLayout";
import HydrateFallback from "@/components/HydrateFallback";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { config } from "@/configs/wagmi";
import "@/styles/globals.css";

export { Layout, HydrateFallback, GlobalErrorBoundary as ErrorBoundary };

const queryClient = new QueryClient();

function Root() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Root;
