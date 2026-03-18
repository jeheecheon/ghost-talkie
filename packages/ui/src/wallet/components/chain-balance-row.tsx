import { Button } from "@workspace/ui/primitives/button";
import ChainIcon from "@workspace/ui/icons/chain-icon";
import { formatTokenBalance } from "@workspace/lib/format";
import { cn } from "@workspace/lib/cn";

type ChainBalanceRowProps = {
  className?: string;
  chainId: number;
  chainName: string;
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
  chainName,
  currencyName,
  currencySymbol,
  balance,
  isLoading,
  showTransfer,
  onTransfer,
}: ChainBalanceRowProps) {
  return (
    <div className={cn("flex h-12 items-center gap-x-3", className)}>
      <ChainIcon chainId={chainId} />

      <div className="flex-1">
        <span className="text-sm font-medium">{currencyName}</span>
        <p className="text-muted-foreground text-xs">{chainName}</p>
      </div>

      <span className="text-muted-foreground text-sm">
        {isLoading ? "—" : `${formatTokenBalance(balance)} ${currencySymbol}`}
      </span>

      {showTransfer && (
        <Button
          variant="outline"
          size="xs"
          disabled={isLoading || balance === 0}
          onClick={onTransfer}
        >
          Transfer
        </Button>
      )}
    </div>
  );
}
