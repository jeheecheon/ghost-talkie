import { createPublicClient, formatEther, http, type Address } from "viem";
import { useQueries } from "@tanstack/react-query";
import { ensure } from "@workspace/lib/assert";
import {
  SUPPORTED_CHAINS,
  type ChainConfig,
} from "@workspace/domain/chain/chains";

const BALANCE_STALE_TIME_MS = 60_000;

const chainClients = SUPPORTED_CHAINS.map((chain) => ({
  chainId: chain.id,
  client: createPublicClient({
    transport: http(chain.rpcUrl),
  }),
}));

export type NativeBalanceEntry = {
  chain: ChainConfig;
  balance: string;
  rawBalance: bigint;
  isLoading: boolean;
};

type UseNativeBalancesReturn = {
  balances: NativeBalanceEntry[];
  isLoading: boolean;
};

export default function useNativeBalances({
  address,
}: {
  address: Address;
}): UseNativeBalancesReturn {
  const results = useQueries({
    queries: SUPPORTED_CHAINS.map((chain, index) => ({
      queryKey: ["nativeBalance", chain.id, address],
      queryFn: async () => {
        const rawBalance = await ensure(chainClients[index], `No chain client at index ${index}`).client.getBalance({
          address,
        });

        return {
          balance: formatEther(rawBalance),
          rawBalance,
        };
      },
      staleTime: BALANCE_STALE_TIME_MS,
    })),
  });

  const balances = SUPPORTED_CHAINS.map((chain, index) => {
    const result = ensure(results[index], `No query result at index ${index}`);

    return {
      chain,
      balance: result.data?.balance ?? "0",
      rawBalance: result.data?.rawBalance ?? 0n,
      isLoading: result.isLoading,
    };
  });

  return {
    balances,
    isLoading: results.some((r) => r.isLoading),
  };
}
