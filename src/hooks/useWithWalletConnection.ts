import { useConnection, useConnect, useConnectors } from "wagmi";
import type { Address } from "viem";
import { useMutation } from "@tanstack/react-query";

export default function useWithWalletConnection() {
  const { address, isConnected } = useConnection();
  const { mutateAsync: connect } = useConnect();
  const connectors = useConnectors();

  const {
    isError,
    isPending,
    isSuccess,
    mutateAsync: withWalletConnection,
  } = useMutation({
    mutationFn: async (action: (address: Address) => Promise<void>) => {
      if (!isConnected || !address) {
        const accounts = await connect({
          connector: connectors[0],
        });
        const address = accounts.accounts[0];
        await action(address);
        return;
      }

      await action(address);
    },
  });

  return {
    isError,
    isPending,
    isSuccess,
    address,
    withWalletConnection,
  };
}
