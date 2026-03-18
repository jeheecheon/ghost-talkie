import { useConnection } from "wagmi";
import type { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAppKit } from "@reown/appkit/react";

export default function useWithWalletConnection() {
  const { address, isConnected } = useConnection();
  const { open } = useAppKit();

  const {
    isError,
    isPending,
    isSuccess,
    mutateAsync: withWalletConnection,
  } = useMutation({
    mutationFn: async (action: (address: Address) => Promise<void>) => {
      if (!isConnected || !address) {
        await open();
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
