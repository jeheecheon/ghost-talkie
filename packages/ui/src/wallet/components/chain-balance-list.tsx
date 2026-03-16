import { useState } from "react";
import type { Nullable } from "@workspace/types/misc";
import type { Address } from "viem";
import { cn } from "@workspace/lib/cn";
import useChainBalances, {
  type ChainBalance,
} from "@workspace/ui/wallet/hooks/use-chain-balances";
import ChainBalanceRow from "@workspace/ui/wallet/components/chain-balance-row";
import TransferDialog from "@workspace/ui/transfer/components/transfer-dialog";

type ChainBalanceListProps = {
  className?: string;
  profileAddress: Address;
  isOwnProfile: boolean;
};

export default function ChainBalanceList({
  className,
  profileAddress,
  isOwnProfile,
}: ChainBalanceListProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] =
    useState<Nullable<ChainBalance>>(null);

  const { balances } = useChainBalances({ address: profileAddress });

  return (
    <div className={cn("", className)}>
      {balances.map((balance) => (
        <ChainBalanceRow
          key={balance.chain.id}
          chainId={balance.chain.id}
          chainName={balance.chain.name}
          balance={balance.formatted}
          showTransfer={isOwnProfile}
          isLoading={balance.isLoading}
          onTransfer={handleTransfer(balance)}
        />
      ))}

      {selectedBalance && (
        <TransferDialog
          isOpen={isTransferDialogOpen}
          chain={selectedBalance.chain}
          balance={selectedBalance.formatted}
          onClose={handleCloseTransferDialog}
        />
      )}
    </div>
  );

  function handleTransfer(balance: ChainBalance) {
    return () => {
      setSelectedBalance(balance);
      setIsTransferDialogOpen(true);
    };
  }

  function handleCloseTransferDialog() {
    setIsTransferDialogOpen(false);
  }
}
