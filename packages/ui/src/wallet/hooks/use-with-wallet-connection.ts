import { useConnection } from "wagmi";
import type { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useWalletSelectDialog } from "@workspace/ui/wallet/context/wallet-select-dialog-provider";

export default function useWithWalletConnection() {
  const { address, isConnected } = useConnection();
  const { open } = useWalletSelectDialog();

  const {
    isError,
    isPending,
    isSuccess,
    mutateAsync: withWalletConnection,
  } = useMutation({
    mutationFn: async (action: (address: Address) => Promise<void>) => {
      if (!isConnected || !address) {
        open();
        return;
      }

      await action(address);
    },
  });

  return {
    isError,
    isPending,
    isSuccess,
    isConnected,
    address,
    withWalletConnection,
  };
}
