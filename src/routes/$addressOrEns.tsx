import { useNavigate } from "react-router";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsName, useEnsAvatar } from "wagmi";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequireWallet } from "@/hooks/useRequireWallet";
import { AppUrlBuilder } from "@/utils/url";
import type { Route } from "./+types/$addressOrEns";

function WalletRoom({ params }: Route.ComponentProps) {
  const { addressOrEns } = params;

  const navigate = useNavigate();
  const {
    isConnected,
    isPending,
    execute: executeWithWallet,
  } = useRequireWallet();

  const isRawAddress = addressOrEns ? isAddress(addressOrEns) : false;
  const hasEnsFormat = addressOrEns?.includes(".");

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: hasEnsFormat && addressOrEns ? normalize(addressOrEns) : undefined,
    query: { enabled: hasEnsFormat },
  });

  const resolvedAddress = isRawAddress ? addressOrEns : ensAddress;

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: resolvedAddress as `0x${string}`,
    query: { enabled: !!resolvedAddress && isRawAddress },
  });

  const finalEnsName = hasEnsFormat ? addressOrEns : ensName;

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: finalEnsName ? normalize(finalEnsName) : undefined,
    query: { enabled: !!finalEnsName },
  });

  const isLoading = isLoadingEnsAddress || isLoadingEnsName || isLoadingAvatar;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !resolvedAddress ? (
        <p className="text-destructive">Invalid address or ENS name</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt="ENS Avatar"
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {finalEnsName && (
            <p className="text-lg font-semibold">{finalEnsName}</p>
          )}

          <p className="text-muted-foreground text-sm">
            {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
          </p>

          <Button onClick={handleStartChat} disabled={isPending}>
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
