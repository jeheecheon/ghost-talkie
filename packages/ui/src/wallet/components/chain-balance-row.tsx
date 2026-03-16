import { Button } from "@workspace/ui/primitives/button";
import ChainIcon from "@workspace/ui/icons/chain-icon";
import { formatTokenBalance } from "@workspace/lib/format";
import { cn } from "@workspace/lib/cn";

type ChainBalanceRowProps = {
  className?: string;
  chainId: number;
  currencyName: string;
  currencySymbol: string;
  balance: number;
  isLoading: boolean;
  showTransfer: boolean;
  onTransfer: () => void;
};

export default function ChainBalanceRow({
  className,
  chainId,
  currencyName,
  currencySymbol,
  balance,
  isLoading,
  showTransfer,
  onTransfer,
}: ChainBalanceRowProps) {
  return (
    <div className={cn("flex h-10 items-center gap-x-3", className)}>
      <ChainIcon chainId={chainId} />

      <span className="flex-1 text-sm font-medium">{currencyName}</span>

      <span className="text-muted-foreground text-sm">
        {isLoading ? "—" : `${formatTokenBalance(balance)} ${currencySymbol}`}
      </span>

      {showTransfer && (
        <Button variant="outline" size="xs" onClick={onTransfer}>
          Transfer
        </Button>
      )}
    </div>
  );
}
