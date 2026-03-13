import { useNavigate } from "react-router";
import { isAddress } from "viem";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
import useWithWalletConnection from "@workspace/ui/wallet/hooks/use-with-wallet-connection";
import useIdentity from "@workspace/ui/wallet/hooks/use-identity";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import { AppUrlBuilder } from "@/utils/url";
import type { Route } from "@/.react-router/routes/+types/$address._index";

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
    address: connectedAddress,
    isPending,
    withWalletConnection,
  } = useWithWalletConnection();
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
            isLoading={isPending}
            isConnected={!!connectedAddress}
            onStartChat={handleStartChat}
          />
          <CommentSection profileAddress={address} />
        </div>
      )}
    </LayoutContainer>
  );

  function handleStartChat() {
    withWalletConnection(async () => {
      navigate(AppUrlBuilder.Chat(address));
    });
  }
}
