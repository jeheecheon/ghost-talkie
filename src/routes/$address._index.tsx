import { useNavigate } from "react-router";
import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/CommentSection";
import { useRequireWallet } from "@/hooks/useRequireWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { AppUrlBuilder } from "@/utils/url";
import { shortenAddress } from "@/utils/address";
import type { Route } from "./+types/$address._index";
import { isAddress } from "viem";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!isAddress(params.address)) {
    throw new Response(null, {
      status: 400,
      statusText: "Invalid Wallet Address",
    });
  }

  return { address: params.address };
}

function WalletProfile({ loaderData }: Route.ComponentProps) {
  const { address } = loaderData;

  const navigate = useNavigate();
  const {
    isConnected,
    isPending,
    execute: executeWithWallet,
  } = useRequireWallet();

  const { data: identity, isLoading } = useIdentity(address);

  return (
    <div className="flex min-h-svh flex-col items-center gap-8 p-4 pt-20">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            {identity?.avatar ? (
              <img
                src={identity.avatar}
                alt="ENS Avatar"
                className="size-24 rounded-full"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-muted">
                <UserIcon className="size-12 text-muted-foreground" />
              </div>
            )}

            {identity?.ensName && (
              <p className="text-lg font-semibold">{identity.ensName}</p>
            )}

            <p className="text-sm text-muted-foreground">
              {shortenAddress(address)}
            </p>

            <Button disabled={isPending} onClick={handleStartChat}>
              {isPending
                ? "Connecting..."
                : isConnected
                  ? "Start Chat"
                  : "Connect Wallet & Start Chat"}
            </Button>
          </div>

          <CommentSection profileAddress={address} />
        </>
      )}
    </div>
  );

  function handleStartChat() {
    executeWithWallet(() => {
      navigate(AppUrlBuilder.Chat(address));
    });
  }
}

export default WalletProfile;
