import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/utils/address";
import { cn } from "@/utils/misc";
import type { EnsIdentity } from "@/types/identity";
import type { Nullable } from "@/types/misc";
import type { Address } from "viem";

type WalletProfileCardProps = {
  className?: string;
  address: Address;
  ensIdentity: Nullable<EnsIdentity>;
  isLoading: boolean;
  isConnected: boolean;
  onStartChat: () => void;
};

export default function WalletProfileCard({
  className,
  address,
  ensIdentity,
  isLoading,
  isConnected,
  onStartChat,
}: WalletProfileCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {ensIdentity?.avatar ? (
        <img
          className="size-24 rounded-full"
          src={ensIdentity.avatar}
          alt="ENS Avatar"
        />
      ) : (
        <div className="bg-muted size-24 rounded-full p-6">
          <UserIcon className="text-muted-foreground size-full" />
        </div>
      )}

      {ensIdentity?.ensName && (
        <p className="text-lg font-semibold">{ensIdentity.ensName}</p>
      )}

      <p className="text-muted-foreground text-sm">{shortenAddress(address)}</p>

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
