import { Button } from "@workspace/ui/primitives/button";
import EnsAvatar from "@workspace/ui/wallet/components/address-avatar";
import ChainBalanceList from "@workspace/ui/wallet/components/chain-balance-list";
import { shortenAddress } from "@workspace/lib/address";
import { cn } from "@workspace/lib/cn";
import { isAddressEqual, type Address } from "viem";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";
import useSignChatProof from "@workspace/ui/chat/hooks/use-sign-chat-proof";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import useWithWalletConnection from "@workspace/ui/wallet/hooks/use-with-wallet-connection";

type WalletProfileCardProps = {
  className?: string;
  address: Address;
};

export default function WalletProfileCard({
  className,
  address: profileAddress,
}: WalletProfileCardProps) {
  const roomAddress = useChatWidgetStore((s) => s.roomAddress);
  const chatProof = useChatWidgetStore((s) => s.chatProof);
  const requestRoom = useChatWidgetStore((s) => s.requestRoom);

  const { signChatProof } = useSignChatProof();

  const {
    address: localAddress,
    isPending,
    withWalletConnection,
  } = useWithWalletConnection();
  const { data: ensProfile } = useEnsProfile({ address: profileAddress });

  const isOwnProfile =
    !!localAddress && isAddressEqual(localAddress, profileAddress);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <EnsAvatar className="size-24" address={profileAddress} />
      <Button className="mt-2" disabled={isPending} onClick={handleStartChat}>
        {isPending
          ? "Connecting..."
          : localAddress
            ? "Start Chat"
            : "Connect Wallet & Start Chat"}
      </Button>

      <p className="text-muted-foreground mt-1.5 text-sm">
        {shortenAddress(profileAddress)}
      </p>
      <p className="h-7 text-lg font-semibold">{ensProfile?.ensName}</p>

      <ChainBalanceList
        className="w-full"
        profileAddress={profileAddress}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );

  async function handleStartChat() {
    withWalletConnection(async (localAddress) => {
      const hasActiveRoom = roomAddress && chatProof;
      const isRoomEqual =
        roomAddress && isAddressEqual(profileAddress, roomAddress);

      if (hasActiveRoom && isRoomEqual) {
        requestRoom(roomAddress, chatProof);
        return;
      }

      const proof = await signChatProof({
        roomAddress: profileAddress,
        signerAddress: localAddress,
      });
      requestRoom(profileAddress, proof);
    });
  }
}
