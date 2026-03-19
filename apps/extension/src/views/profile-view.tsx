import LayoutContainer from "@workspace/ui/primitives/layout-container";
import WalletProfileCard from "@workspace/ui/wallet/components/wallet-profile-card";
import ChainBalanceSection from "@workspace/ui/wallet/components/chain-balance-section";
import CommentSection from "@workspace/ui/comment/components/comment-section";
import type { Address } from "viem";
import { cn } from "@workspace/lib/cn";

type ProfileViewProps = {
  className?: string;
  address: Address;
};

export default function ProfileView({ className, address }: ProfileViewProps) {
  return (
    <LayoutContainer className={cn("space-y-10", className)}>
      <WalletProfileCard address={address} />
      <hr />
      <ChainBalanceSection profileAddress={address} />
      <hr />
      <CommentSection address={address} />
    </LayoutContainer>
  );
}
