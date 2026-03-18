import { useState } from "react";
import { useConnection, useConnect, useConnectors } from "wagmi";
import { Button } from "@workspace/ui/primitives/button";
import { shortenAddress } from "@workspace/lib/address";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import { ensure } from "@workspace/lib/assert";
import WalletConnectionDialog from "@workspace/ui/header/components/wallet-connection-dialog";

type WalletChipProps = {
  className?: string;
  onNavigate: (path: string) => void;
};

export default function WalletChip({ className, onNavigate }: WalletChipProps) {
  const [isDialogOpen, setIsDrawerOpen] = useState(false);

  const { address, isConnected } = useConnection();
  const { mutate: connect } = useConnect();
  const connectors = useConnectors();
  const { data: ensProfile } = useEnsProfile({ address });

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
          <WalletConnectionDialog
            address={address}
            ensProfile={ensProfile}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onNavigate={onNavigate}
          />
        </>
      ) : (
        <Button size="sm" onClick={handleConnect}>
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

  function handleConnect() {
    const connector = ensure(connectors[0], "No connector available");
    connect({ connector });
  }
}
