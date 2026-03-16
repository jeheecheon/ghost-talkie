import {
  createPublicClient,
  formatEther,
  http,
  type Address,
  type Chain,
} from "viem";
import { useQueries } from "@tanstack/react-query";
import { assert } from "@workspace/lib/assert";
import { SUPPORTED_CHAINS } from "@workspace/ui/wallet/configs/wagmi";

const chainClients = SUPPORTED_CHAINS.map((chain) =>
  createPublicClient({
    transport: http(chain.rpcUrls.default.http[0]),
  }),
);

export type ChainBalance = {
  chain: Chain;
  raw: bigint;
  formatted: string;
  isLoading: boolean;
};

type UseChainBalancesReturn = {
  balances: ChainBalance[];
  isLoading: boolean;
};

export default function useChainBalances({
  address,
}: {
  address: Address;
}): UseChainBalancesReturn {
  const balances = useQueries({
    queries: SUPPORTED_CHAINS.map((chain, index) => ({
      queryKey: ["chainBalance", chain.id, address],
      queryFn: async () => {
        const client = chainClients[index];
        assert(client, `No chain client at index ${index}`);

        const raw = await client.getBalance({
          address,
        });
        const formatted = formatEther(raw);

        return {
          raw,
          formatted,
        };
      },
    })),
    combine: (queries) => {
      return queries.map((result, index) => {
        const chain = SUPPORTED_CHAINS[index];
        assert(chain, `No chain found for index ${index}`);

        return {
          ...result,
          chain,
          raw: result.data?.raw ?? 0n,
          formatted: result.data?.formatted ?? "0",
        };
      });
    },
  });

  const isLoading = balances.some((r) => r.isLoading);

  return {
    balances,
    isLoading,
  };
}
