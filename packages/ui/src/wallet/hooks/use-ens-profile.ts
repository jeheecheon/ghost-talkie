import type { EnsProfile } from "@workspace/ui/wallet/types";
import type { Maybe, Nullable } from "@workspace/types/misc";
import type { Address } from "viem";
import { normalize } from "viem/ens";
import { useEnsName, useEnsAvatar } from "wagmi";

type UseEnsProfileReturn = {
  isLoading: boolean;
  data: Nullable<EnsProfile>;
};

export default function useEnsProfile({
  address,
  enabled = true,
}: {
  address: Maybe<Address>;
  enabled?: boolean;
}): UseEnsProfileReturn {
  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: address ?? undefined,
    query: { enabled },
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    query: { enabled: enabled && !!ensName },
  });

  return {
    isLoading: isLoadingEnsName || isLoadingAvatar,
    data: {
      address,
      ensName,
      avatar,
    },
  };
}
