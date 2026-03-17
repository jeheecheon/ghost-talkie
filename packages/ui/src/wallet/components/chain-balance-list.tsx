import { useState } from "react";
import type { Nullable } from "@workspace/types/misc";
import type { Address } from "viem";
import { cn } from "@workspace/lib/cn";
import useChainBalances, {
  type ChainBalance,
} from "@workspace/ui/wallet/hooks/use-chain-balances";
import ChainBalanceRow from "@workspace/ui/wallet/components/chain-balance-row";
import TransferDialog from "@workspace/ui/transfer/components/transfer-dialog";
import { isAddressEqual } from "viem";
import { useConnection } from "wagmi";

type ChainBalanceListProps = {
  className?: string;
  profileAddress: Address;
};

export default function ChainBalanceList({
  className,
  profileAddress,
}: ChainBalanceListProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] =
    useState<Nullable<ChainBalance>>(null);

  const { balances } = useChainBalances({ address: profileAddress });
  const { address: localAddress } = useConnection();

  const isOwnProfile =
    !!localAddress && isAddressEqual(localAddress, profileAddress);

  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-lg font-semibold">Assets</h2>

      {balances.map((balance) => (
        <ChainBalanceRow
          key={balance.chain.id}
          chainId={balance.chain.id}
          chainName={balance.chain.name}
          currencyName={balance.chain.nativeCurrency.name}
          currencySymbol={balance.chain.nativeCurrency.symbol}
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
