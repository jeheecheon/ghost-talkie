import { isAddress } from "viem";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
import ChainBalanceSection from "@workspace/ui/wallet/components/chain-balance-section";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
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
  const { address: profileAddress } = loaderData;

  return (
    <LayoutContainer className="space-y-10">
      <WalletProfileCard address={profileAddress} />
      <hr />
      <ChainBalanceSection profileAddress={profileAddress} />
      <hr />
      <CommentSection address={profileAddress} />
    </LayoutContainer>
  );
}
