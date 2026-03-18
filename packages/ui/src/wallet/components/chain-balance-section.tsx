import { useState } from "react";
import { isAddressEqual, type Address } from "viem";
import { useConnection } from "wagmi";
import { cn } from "@workspace/lib/cn";
import useChainBalances, {
  type ChainBalance,
} from "@workspace/ui/wallet/hooks/use-chain-balances";
import ChainBalanceList from "@workspace/ui/wallet/components/chain-balance-list";
import TransferDialog from "@workspace/ui/transfer/components/transfer-dialog";
import type { Nullable } from "@workspace/types/misc";

type ChainBalanceSectionProps = {
  className?: string;
  profileAddress: Address;
};

export default function ChainBalanceSection({
  className,
  profileAddress,
}: ChainBalanceSectionProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] =
    useState<Nullable<ChainBalance>>(null);

  const { balances } = useChainBalances({ address: profileAddress });
  const { address: localAddress } = useConnection();

  const isOwnProfile =
    !!localAddress && isAddressEqual(localAddress, profileAddress);

  return (
    <section className={cn("space-y-2", className)}>
      <h2 className="text-lg font-semibold">Assets</h2>

      <ChainBalanceList
        balances={balances}
        showTransfer={isOwnProfile}
        onTransfer={handleTransfer}
      />

      {selectedBalance && (
        <TransferDialog
          isOpen={isTransferDialogOpen}
          chain={selectedBalance.chain}
          balance={selectedBalance.formatted}
          onClose={handleCloseTransferDialog}
        />
      )}
    </section>
  );

  function handleTransfer(balance: ChainBalance) {
    setSelectedBalance(balance);
    setIsTransferDialogOpen(true);
  }

  function handleCloseTransferDialog() {
    setIsTransferDialogOpen(false);
  }
}
