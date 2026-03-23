import { isAddress } from "viem";
import { ENV } from "@/configs/env";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
import ChainBalanceSection from "@workspace/ui/wallet/components/chain-balance-section";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import type { Route } from "@/.react-router/routes/+types/$address._index";

export function meta() {
  return [
    { title: "Wallet Profile | GhostTalkie" },
    {
      name: "description",
      content: "View wallet profile, balances, and comments on GhostTalkie.",
    },
    { property: "og:title", content: "Wallet Profile | GhostTalkie" },
    {
      property: "og:description",
      content: "View wallet profile, balances, and comments on GhostTalkie.",
    },
    { property: "og:type", content: "profile" },
    { property: "og:image", content: `${ENV.BASE_PATH}ghost.svg` },
    { property: "og:site_name", content: "GhostTalkie" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Wallet Profile | GhostTalkie" },
    {
      name: "twitter:description",
      content: "View wallet profile, balances, and comments on GhostTalkie.",
    },
    { name: "twitter:image", content: `${ENV.BASE_PATH}ghost.svg` },
  ];
}

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
