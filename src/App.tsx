import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">GhostTalkie</h1>

      {isConnected ? (
        <>
          <p className="text-muted-foreground text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <Button variant="outline" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          disabled={isPending}
          onClick={() => connect({ connector: connectors[0] })}
        >
          {isPending ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  );
}

export default App;
