import { useState } from "react";
import { useConnection } from "wagmi";
import { Button } from "@workspace/ui/primitives/button";
import { shortenAddress } from "@workspace/lib/address";
import { useWalletSelectDialog } from "@workspace/ui/wallet/context/wallet-select-dialog-provider";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import WalletDetailDialog from "@workspace/ui/wallet/components/wallet-detail-dialog";

type WalletChipProps = {
  className?: string;
  onNavigate: (path: string) => void;
};

export default function WalletChip({ className, onNavigate }: WalletChipProps) {
  const [isDialogOpen, setIsDrawerOpen] = useState(false);

  const { address, isConnected } = useConnection();
  const { data: ensProfile } = useEnsProfile({ address });
  const { open } = useWalletSelectDialog();

  const displayName =
    ensProfile?.ensName ?? (address ? shortenAddress(address) : "");

  return (
    <div className={className}>
      {isConnected && address ? (
        <>
          <Button
            className="text-sm"
            variant="ghost"
            size="sm"
            onClick={handleOpenDialog}
          >
            {displayName}
          </Button>
          <WalletDetailDialog
            address={address}
            ensProfile={ensProfile}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onNavigate={onNavigate}
          />
        </>
      ) : (
        <Button size="sm" onClick={open}>
          Connect
        </Button>
      )}
    </div>
  );

  function handleOpenDialog() {
    setIsDrawerOpen(true);
  }

  function handleCloseDialog() {
    setIsDrawerOpen(false);
  }
}
