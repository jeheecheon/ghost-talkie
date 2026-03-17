import { useState } from "react";
import { type Chain, type Hash } from "viem";
import type { Nullable } from "@workspace/types/misc";
import TransferInputStep from "@workspace/ui/transfer/components/transfer-input-step";
import TransferSuccessStep from "@workspace/ui/transfer/components/transfer-success-step";

type TransferFormProps = {
  className?: string;
  chain: Chain;
  balance: number;
  onSuccess: () => void;
};

export default function TransferForm({
  className,
  chain,
  balance,
  onSuccess,
}: TransferFormProps) {
  const [txHash, setTxHash] = useState<Nullable<Hash>>(null);

  return (
    <div className={className}>
      {!txHash ? (
        <TransferInputStep chain={chain} balance={balance} onSend={setTxHash} />
      ) : (
        <TransferSuccessStep chain={chain} txHash={txHash} onDone={onSuccess} />
      )}
    </div>
  );
}
