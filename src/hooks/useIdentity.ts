import type { Nullable } from "@/types/misc";
import type { Address } from "viem";
import { normalize } from "viem/ens";
import { useEnsName, useEnsAvatar } from "wagmi";

interface UseIdentityReturn {
  isLoading: boolean;
  data: Nullable<{
    ensName: Nullable<string>;
    avatar: Nullable<string>;
  }>;
}

export function useIdentity(address: Address): UseIdentityReturn {
  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address,
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    query: { enabled: !!ensName },
  });

  return {
    isLoading: isLoadingEnsName || isLoadingAvatar,
    data: {
      ensName: ensName ?? null,
      avatar: avatar ?? null,
    },
  };
}
