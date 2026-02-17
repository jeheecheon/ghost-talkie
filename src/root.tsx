import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Layout } from "./components/RootLayout";
import { HydrateFallback } from "./components/HydrateFallback";
import { config } from "./wagmi";
import "./index.css";

const queryClient = new QueryClient();

export { Layout, HydrateFallback };

export default function Root() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
