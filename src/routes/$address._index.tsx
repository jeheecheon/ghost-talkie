import { useNavigate } from "react-router";
import CommentSection from "@/components/CommentSection";
import WalletProfileCard from "@/components/WalletProfileCard";
import useRequireWallet from "@/hooks/useRequireWallet";
import useIdentity from "@/hooks/useIdentity";
import { AppUrlBuilder } from "@/utils/url";
import type { Route } from "./+types/$address._index";
import { isAddress } from "viem";
import LayoutContainer from "@/components/LayoutContainer";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!isAddress(params.address)) {
    throw new Response(null, {
      status: 400,
      statusText: "Invalid Wallet Address",
    });
  }

  return { address: params.address };
}

export default function WalletProfileRoute({
  loaderData,
}: Route.ComponentProps) {
  const { address } = loaderData;

  const navigate = useNavigate();
  const {
    isConnected,
    isPending: isWalletLoading,
    mutate: executeWithWallet,
  } = useRequireWallet();

  const { data: ensIdentity, isLoading: isIdentityLoading } =
    useIdentity(address);

  return (
    <LayoutContainer>
      {isIdentityLoading ? (
        // TODO: show loading skeleton
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-10 pt-20 pb-10">
          <WalletProfileCard
            address={address}
            ensIdentity={ensIdentity}
            isLoading={isWalletLoading}
            isConnected={isConnected}
            onStartChat={handleStartChat}
          />
          <CommentSection profileAddress={address} />
        </div>
      )}
    </LayoutContainer>
  );

  function handleStartChat() {
    executeWithWallet(async () => {
      navigate(AppUrlBuilder.Chat(address));
    });
  }
}
