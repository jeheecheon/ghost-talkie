import { isAddress } from "viem";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import type { Route } from "@/.react-router/routes/+types/$address._index";
import ChainBalanceList from "@workspace/ui/wallet/components/chain-balance-list";

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
    <LayoutContainer className="space-y-10 pt-20 pb-10">
      <WalletProfileCard address={profileAddress} />
      <hr className="border-border w-full" />
      <ChainBalanceList
        className="mt-6 w-full"
        profileAddress={profileAddress}
      />
      <hr className="border-border w-full" />
      <CommentSection address={profileAddress} />
    </LayoutContainer>
  );
}
