import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsName, useEnsAvatar } from "wagmi";
import type { Optional } from "@/types/misc";
import type { ResolvedIdentity } from "@/types/ens";

interface UseResolveAddressOrEnsArgs {
  addressOrEns: string;
}

interface UseResolveAddressOrEnsReturn {
  data: Optional<ResolvedIdentity>;
  isLoading: boolean;
}

export function useIdentity({
  addressOrEns,
}: UseResolveAddressOrEnsArgs): UseResolveAddressOrEnsReturn {
  const isRawAddress = isAddress(addressOrEns);
  const hasEnsFormat = addressOrEns.includes(".");

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: hasEnsFormat ? normalize(addressOrEns) : undefined,
    query: { enabled: hasEnsFormat },
  });

  const resolvedAddress = isRawAddress ? addressOrEns : ensAddress;

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: resolvedAddress ?? undefined,
    query: { enabled: !!resolvedAddress && isRawAddress },
  });

  const finalEnsName = hasEnsFormat ? addressOrEns : ensName;

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: finalEnsName ? normalize(finalEnsName) : undefined,
    query: { enabled: !!finalEnsName },
  });

  const isLoading = isLoadingEnsAddress || isLoadingEnsName || isLoadingAvatar;

  return {
    data: {
      address: resolvedAddress ?? null,
      ensName: finalEnsName ?? null,
      avatar: avatar ?? null,
    },
    isLoading,
  };
}
