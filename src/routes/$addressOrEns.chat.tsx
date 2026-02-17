import { useIdentity } from "@/hooks/useIdentity";
import type { Route } from "./+types/$addressOrEns.chat";

function Chat({ params }: Route.ComponentProps) {
  const { addressOrEns } = params;

  const { data: identity, isLoading } = useIdentity({
    addressOrEns,
  });

  return (
    <div className="flex min-h-svh items-center justify-center">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !identity ? (
        <p className="text-destructive">Invalid address or ENS name</p>
      ) : (
        <p className="text-muted-foreground">
          Chat with {identity.ensName ?? identity.address}
        </p>
      )}
    </div>
  );
}

export default Chat;
