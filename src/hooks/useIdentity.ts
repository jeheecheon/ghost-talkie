import type { EnsIdentity } from "@/types/identity";
import type { Nullable } from "@/types/misc";
import type { Address } from "viem";
import { normalize } from "viem/ens";
import { useEnsName, useEnsAvatar } from "wagmi";

type UseIdentityReturn = {
  isLoading: boolean;
  data: Nullable<EnsIdentity>;
};

export default function useIdentity(address: Address): UseIdentityReturn {
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
      address,
      ensName: ensName ?? null,
      avatar: avatar ?? null,
    },
  };
}
