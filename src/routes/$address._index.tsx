import { useNavigate } from "react-router";
import CommentSection from "@/components/CommentSection";
import WalletProfileCard from "@/components/WalletProfileCard";
import { useRequireWallet } from "@/hooks/useRequireWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { AppUrlBuilder } from "@/utils/url";
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
    isLoading,
    execute: executeWithWallet,
  } = useRequireWallet();

  const { data: identity, isLoading } = useIdentity(address);

  return (
    <div className="flex min-h-svh flex-col items-center gap-8 p-4 pt-20">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <WalletProfileCard
            address={address}
            identity={identity}
            isLoading={isLoading}
            isConnected={isConnected}
            onStartChat={handleStartChat}
          />

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
