import { useConnection, useConnect, useConnectors, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export default function HomeRoute() {
  const { address, isConnected } = useConnection();
  const connectMutation = useConnect();
  const connectors = useConnectors();
  const disconnectMutation = useDisconnect();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">GhostTalkie</h1>

      {isConnected ? (
        <>
          <p className="text-muted-foreground text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <Button variant="outline" onClick={() => disconnectMutation.mutate()}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          disabled={connectMutation.isPending}
          onClick={() => connectMutation.mutate({ connector: connectors[0] })}
        >
          {connectMutation.isPending ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  );
}
