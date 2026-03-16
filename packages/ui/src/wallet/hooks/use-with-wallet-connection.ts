import { useConnection, useConnect, useConnectors } from "wagmi";
import type { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { ensure } from "@workspace/lib/assert";

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
          connector: ensure(connectors[0], "No wallet connector available"),
        });
        const address = ensure(
          accounts.accounts[0],
          "No account returned after connection",
        );
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
