import { User, Unplug } from "lucide-react";
import { useDisconnect } from "wagmi";
import type { Address } from "viem";
import type { Nullable } from "@workspace/types/misc";
import type { EnsProfile } from "@workspace/ui/wallet/types";
import { Button } from "@workspace/ui/primitives/button";
import CopyableText from "@workspace/ui/primitives/copyable-text";
import ResponsiveDialog from "@workspace/ui/primitives/responsive-dialog";

type WalletDetailDialogProps = {
  className?: string;
  isOpen: boolean;
  address: Address;
  ensProfile: Nullable<EnsProfile>;
  onClose: () => void;
  onNavigate: (path: string) => void;
};

export default function WalletDetailDialog({
  className,
  isOpen,
  address,
  ensProfile,
  onClose,
  onNavigate,
}: WalletDetailDialogProps) {
  const { mutate: disconnect } = useDisconnect();

  return (
    <ResponsiveDialog
      className={className}
      isOpen={isOpen}
      title="Connected Wallet"
      onClose={onClose}
    >
      <div className="space-y-4 px-4">
        <div className="space-y-1">
          {ensProfile?.ensName && (
            <p className="text-sm font-medium">{ensProfile.ensName}</p>
          )}
          <CopyableText
            className="text-muted-foreground text-sm"
            value={address}
            toastMessage="Address copied"
          >
            {address}
          </CopyableText>
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={handleMyProfile}>
            <User />
            My Profile
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleDisconnect}
          >
            <Unplug />
            Disconnect
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );

  function handleMyProfile() {
    onClose();
    onNavigate(`/${address}`);
  }

  function handleDisconnect() {
    disconnect();
    onClose();
  }
}
