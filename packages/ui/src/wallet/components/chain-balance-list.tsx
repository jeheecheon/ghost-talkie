import { cn } from "@workspace/lib/cn";
import type { ChainBalance } from "@workspace/ui/wallet/hooks/use-chain-balances";
import ChainBalanceRow from "@workspace/ui/wallet/components/chain-balance-row";

type ChainBalanceListProps = {
  className?: string;
  balances: ChainBalance[];
  showTransfer: boolean;
  onTransfer: (balance: ChainBalance) => void;
};

export default function ChainBalanceList({
  className,
  balances,
  showTransfer,
  onTransfer,
}: ChainBalanceListProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {balances.map((balance) => (
        <li key={balance.chain.id}>
          <ChainBalanceRow
            chainId={balance.chain.id}
            chainName={balance.chain.name}
            currencyName={balance.chain.nativeCurrency.name}
            currencySymbol={balance.chain.nativeCurrency.symbol}
            balance={balance.formatted}
            showTransfer={showTransfer}
            isLoading={balance.isLoading}
            onTransfer={handleTransfer(balance)}
          />
        </li>
      ))}
    </ul>
  );

  function handleTransfer(balance: ChainBalance) {
    return () => {
      onTransfer(balance);
    };
  }
}
