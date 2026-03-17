import { useState, type FormEvent } from "react";
import { isAddress, type Chain, type Hash } from "viem";
import { cn } from "@workspace/lib/cn";
import { formatTokenBalance } from "@workspace/lib/format";
import { Button } from "@workspace/ui/primitives/button";
import { Input } from "@workspace/ui/primitives/input";
import { Label } from "@workspace/ui/primitives/label";
import ChainIcon from "@workspace/ui/icons/chain-icon";
import useSendNativeToken from "@workspace/ui/transfer/hooks/use-send-native-token";
import { toast } from "sonner";

type TransferInputStepProps = {
  className?: string;
  chain: Chain;
  balance: number;
  onSend: (txHash: Hash) => void;
};

export default function TransferInputStep({
  className,
  chain,
  balance,
  onSend,
}: TransferInputStepProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { sendNativeToken, isLoading } = useSendNativeToken();

  const parsedAmount = parseFloat(amount);

  const isRecipientTouched = recipient.length > 0;
  const isRecipientValid = isAddress(recipient);
  const isAmountExceeding = parsedAmount > balance;
  const isAmountValid = !isAmountExceeding && Number.isFinite(parsedAmount);

  return (
    <form className={cn("space-y-4", className)} onSubmit={handleSubmit}>
      <section className="space-y-1.5">
        <Label htmlFor="transfer-recipient">To</Label>
        <Input
          id="transfer-recipient"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        {isRecipientTouched && !isRecipientValid && (
          <p className="text-destructive text-xs">Invalid address</p>
        )}
      </section>

      <section className="space-y-1.5">
        <Label htmlFor="transfer-amount">Amount</Label>

        <div className="flex gap-x-2">
          <div className="relative flex-1">
            <Input
              className="pr-14"
              id="transfer-amount"
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
              {chain.nativeCurrency.symbol}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleMax}
          >
            MAX
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <ChainIcon className="size-3.5" chainId={chain.id} />
          <p className="text-muted-foreground text-xs">
            Balance: {formatTokenBalance(balance)} {chain.nativeCurrency.symbol}
          </p>
        </div>

        {isAmountExceeding && (
          <p className="text-destructive text-xs">Insufficient balance</p>
        )}
      </section>

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading || !isRecipientValid || !isAmountValid}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );

  function handleMax() {
    setAmount(balance.toString());
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }

    try {
      const hash = await sendNativeToken({
        to: recipient,
        amount,
        chain,
      });
      onSend(hash);
    } catch {
      // INFO: Error already surfaced via toast in useSendNativeToken
    }
  }
}
