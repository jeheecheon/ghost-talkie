import { useConnection, useConnect, useConnectors } from "wagmi";
import type { Address } from "viem";
import { useMutation } from "@tanstack/react-query";

export default function useRequireWallet() {
  const { address, isConnected, isConnecting, isReconnecting } =
    useConnection();
  const connectMutation = useConnect();
  const connectors = useConnectors();

  const mutation = useMutation({
    mutationFn: async (action: (address: Address) => Promise<void>) => {
      if (!isConnected || !address) {
        const accounts = await connectMutation.mutateAsync({
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
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    ...mutation,
  };
}
