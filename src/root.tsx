import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Layout } from "./components/RootLayout";
import { config } from "./wagmi";
import "./index.css";

const queryClient = new QueryClient();

export { Layout };

export default function Root() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
