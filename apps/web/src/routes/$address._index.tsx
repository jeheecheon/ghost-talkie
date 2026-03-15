import { isAddress } from "viem";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
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
  const { address } = loaderData;

  return (
    <LayoutContainer className="space-y-10 pt-20 pb-10">
      <WalletProfileCard address={address} />
      <CommentSection address={address} />
    </LayoutContainer>
  );
}
