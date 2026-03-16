import ResponsiveDialog from "@workspace/ui/primitives/responsive-dialog";
import TransferForm from "@workspace/ui/transfer/components/transfer-form";
import type { Chain } from "viem/chains";

type TransferDialogProps = {
  className?: string;
  isOpen: boolean;
  chain: Chain;
  balance: number;
  onClose: () => void;
};

export default function TransferDialog({
  className,
  isOpen,
  chain,
  balance,
  onClose,
}: TransferDialogProps) {
  return (
    <ResponsiveDialog
      className={className}
      isOpen={isOpen}
      title={`Send ${chain.nativeCurrency.symbol}`}
      onClose={onClose}
    >
      <TransferForm chain={chain} balance={balance} onSuccess={onClose} />
    </ResponsiveDialog>
  );
}
