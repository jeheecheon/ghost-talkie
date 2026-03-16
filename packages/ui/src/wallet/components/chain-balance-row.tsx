import { Button } from "@workspace/ui/primitives/button";
import ChainIcon from "@workspace/ui/icons/chain-icon";
import { formatTokenBalance } from "@workspace/lib/format";
import { cn } from "@workspace/lib/cn";

type ChainBalanceRowProps = {
  className?: string;
  chainId: number;
  chainName: string;
  balance: number;
  isLoading: boolean;
  showTransfer: boolean;
  onTransfer: () => void;
};

export default function ChainBalanceRow({
  className,
  chainId,
  chainName,
  balance,
  isLoading,
  showTransfer,
  onTransfer,
}: ChainBalanceRowProps) {
  return (
    <div className={cn("flex h-10 items-center gap-x-3", className)}>
      <ChainIcon chainId={chainId} />

      <span className="flex-1 text-sm font-medium">{chainName}</span>

      <span className="text-muted-foreground text-sm">
        {isLoading ? "—" : formatTokenBalance(balance)}
      </span>

      {showTransfer && (
        <Button variant="outline" size="xs" onClick={onTransfer}>
          Transfer
        </Button>
      )}
    </div>
  );
}
