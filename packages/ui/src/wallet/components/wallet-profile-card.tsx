import { Button } from "@workspace/ui/primitives/button";
import EnsAvatar from "@workspace/ui/wallet/components/address-avatar";
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

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <EnsAvatar className="size-24" address={profileAddress} />

      {ensProfile?.ensName && (
        <p className="text-lg font-semibold">{ensProfile.ensName}</p>
      )}

      <p className="text-muted-foreground text-sm">
        {shortenAddress(profileAddress)}
      </p>

      <Button disabled={isPending} onClick={handleStartChat}>
        {isPending
          ? "Connecting..."
          : localAddress
            ? "Start Chat"
            : "Connect Wallet & Start Chat"}
      </Button>
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
