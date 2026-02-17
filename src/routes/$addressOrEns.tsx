import { useNavigate } from "react-router";
import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useRequireWallet } from "@/hooks/useRequireWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { AppUrlBuilder } from "@/utils/url";
import type { Route } from "./+types/$addressOrEns";
import { shortenAddress } from "@/utils/address";

function WalletRoom({ params }: Route.ComponentProps) {
  const { addressOrEns } = params;

  const navigate = useNavigate();
  const {
    isConnected,
    isPending,
    execute: executeWithWallet,
  } = useRequireWallet();

  const { data: identity, isLoading } = useIdentity({
    addressOrEns,
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !identity ? (
        <p className="text-destructive">Invalid address or ENS name</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {identity.avatar ? (
            <img
              src={identity.avatar}
              alt="ENS Avatar"
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {identity.ensName && (
            <p className="text-lg font-semibold">{identity.ensName}</p>
          )}

          {identity.address && (
            <p className="text-muted-foreground text-sm">
              {shortenAddress(identity.address)}
            </p>
          )}

          <Button disabled={isPending} onClick={handleStartChat}>
            {isPending
              ? "Connecting..."
              : isConnected
                ? "Start Chat"
                : "Connect Wallet & Start Chat"}
          </Button>
        </div>
      )}
    </div>
  );

  function handleStartChat() {
    executeWithWallet(() => {
      navigate(AppUrlBuilder.Chat(addressOrEns));
    });
  }
}

export default WalletRoom;
