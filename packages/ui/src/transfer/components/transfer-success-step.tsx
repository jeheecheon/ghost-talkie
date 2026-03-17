import type { Chain, Hash } from "viem";
import { cn } from "@workspace/lib/cn";
import { Button } from "@workspace/ui/primitives/button";
import { CircleCheck, ExternalLink } from "lucide-react";

type TransferSuccessStepProps = {
  className?: string;
  chain: Chain;
  txHash: Hash;
  onDone: () => void;
};

export default function TransferSuccessStep({
  className,
  chain,
  txHash,
  onDone,
}: TransferSuccessStepProps) {
  const explorerUrl = chain.blockExplorers?.default.url
    ? `${chain.blockExplorers.default.url}/tx/${txHash}`
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col items-center gap-y-2">
        <CircleCheck className="size-10 text-emerald-500" />

        <p className="text-sm font-medium">Transaction sent!</p>

        {explorerUrl && (
          <a
            className="text-primary inline-flex items-center gap-x-1 text-sm underline"
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on {chain.name} Explorer
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      <Button className="w-full" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
