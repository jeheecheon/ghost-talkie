import { toast } from "sonner";
import { parseEther, type Address } from "viem";
import { useConnection, useSendTransaction, useSwitchChain } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@workspace/ui/wallet/configs/wagmi";
import type { Chain } from "viem";
import { useState } from "react";

type SendNativeTokenParams = {
  to: Address;
  amount: string;
  chain: Chain;
};

type UseSendNativeTokenReturn = {
  sendNativeToken: (params: SendNativeTokenParams) => Promise<void>;
  isLoading: boolean;
};

export default function useSendNativeToken(): UseSendNativeTokenReturn {
  const [isLoading, setIsLoading] = useState(false);

  const { chainId: currentChainId } = useConnection();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { mutateAsync: switchChain } = useSwitchChain();

  return {
    sendNativeToken,
    isLoading,
  };

  async function sendNativeToken({
    to,
    amount,
    chain,
  }: SendNativeTokenParams): Promise<void> {
    setIsLoading(true);

    try {
      if (currentChainId !== chain.id) {
        await toast
          .promise(switchChain({ chainId: chain.id }), {
            loading: "Switching chain...",
            success: "Chain switched successfully",
            error: "Failed to switch chain",
          })
          .unwrap();
      }

      const hash = await toast
        .promise(
          sendTransaction({
            to,
            value: parseEther(amount),
            chainId: chain.id,
          }),
          {
            loading: "Sending transaction...",
            success: "Transaction sent successfully",
            error: "Failed to send transaction",
          },
        )
        .unwrap();

      const receipt = await toast
        .promise(waitForTransactionReceipt(config, { hash }), {
          loading: "Waiting for receipt...",
          success: "Transaction confirmed",
          error: "Transaction failed",
        })
        .unwrap();

      const href = `${chain.blockExplorers?.default.url}/tx/${hash}`;
      toast.success(`Confirmed in block #${receipt.blockNumber}`, {
        action: {
          label: "View on explorer",
          onClick: () => window.open(href, "_blank", "noopener,noreferrer"),
        },
      });
    } catch {
      toast.error("Failed to send token...");
    } finally {
      setIsLoading(false);
    }
  }
}
