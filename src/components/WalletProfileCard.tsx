import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/utils/address";
import { cn } from "@/utils/misc";
import type { Nullable } from "@/types/misc";
import type { Address } from "viem";

type Props = {
  className?: string;
  address: Address;
  identity: Nullable<{
    ensName: Nullable<string>;
    avatar: Nullable<string>;
  }>;
  isLoading: boolean;
  isConnected: boolean;
  onStartChat: () => void;
};

function WalletProfileCard({
  className,
  address,
  identity,
  isLoading,
  isConnected,
  onStartChat,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {identity?.avatar ? (
        <img
          className="size-24 rounded-full"
          src={identity.avatar}
          alt="ENS Avatar"
        />
      ) : (
        <div className="flex size-24 items-center justify-center rounded-full bg-muted">
          <UserIcon className="size-12 text-muted-foreground" />
        </div>
      )}

      {identity?.ensName && (
        <p className="text-lg font-semibold">{identity.ensName}</p>
      )}

      <p className="text-sm text-muted-foreground">{shortenAddress(address)}</p>

      <Button disabled={isLoading} onClick={onStartChat}>
        {isLoading
          ? "Connecting..."
          : isConnected
            ? "Start Chat"
            : "Connect Wallet & Start Chat"}
      </Button>
    </div>
  );
}

export default WalletProfileCard;
