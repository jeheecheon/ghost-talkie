import { isAddress, type Address } from "viem";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsName } from "wagmi";
import type { Optional } from "@workspace/types/misc";

type UseEnsLookupArgs = {
  query: string;
  enabled?: boolean;
};

type UseEnsLookupReturn = {
  ensAddress: Optional<Address>;
  ensName: Optional<string>;
  isLoading: boolean;
  status: EnsLookupStatus;
};

export default function useEnsLookup({
  query,
  enabled = true,
}: UseEnsLookupArgs): UseEnsLookupReturn {
  const isEnsAddress = isAddress(query);
  const isEnsName = !isEnsAddress && query.includes(".");

  const { data: _ensAddress, isLoading: isAddressLoading } = useEnsAddress({
    name: isEnsName ? tryNormalize(query) : undefined,
    query: { enabled: enabled && isEnsName, retry: false },
  });
  const { data: _ensName, isLoading: isNameLoading } = useEnsName({
    address: isEnsAddress ? query : undefined,
    query: { enabled: enabled && isEnsAddress, retry: false },
  });

  const ensName: Optional<string> = isEnsName ? query : (_ensName ?? undefined);
  const ensAddress: Optional<Address> = isEnsAddress
    ? query
    : (_ensAddress ?? undefined);

  const isLoading = isAddressLoading || isNameLoading;

  const status = deriveStatus({
    query,
    ensAddress: _ensAddress ?? undefined,
    ensName: _ensName ?? undefined,
    isLoading,
  });

  return { ensAddress, ensName, isLoading, status };
}

function tryNormalize(name: string): Optional<string> {
  try {
    return normalize(name);
  } catch {
    return undefined;
  }
}

type DeriveStatusArgs = {
  query: string;
  ensAddress: Optional<Address>;
  ensName: Optional<string>;
  isLoading: boolean;
};

type EnsLookupStatus =
  | "idle"
  | "address-resolving"
  | "address-resolved"
  | "address-not-found"
  | "name-resolving"
  | "name-resolved"
  | "name-not-found"
  | "invalid-format";

function deriveStatus({
  query,
  ensAddress,
  ensName,
  isLoading,
}: DeriveStatusArgs): EnsLookupStatus {
  if (query.length === 0) {
    return "idle";
  }

  const isValidAddress = isAddress(query);
  const isEnsQuery = !isValidAddress && query.includes(".");

  if (!isValidAddress && !isEnsQuery) {
    return "invalid-format";
  }

  if (isEnsQuery && !ensAddress && isLoading) {
    return "name-resolving";
  }

  if (isEnsQuery && !ensAddress && !isLoading) {
    return "name-not-found";
  }

  if (isEnsQuery && ensAddress) {
    return "name-resolved";
  }

  if (isValidAddress && !ensName && isLoading) {
    return "address-resolving";
  }

  if (isValidAddress && !ensName && !isLoading) {
    return "address-not-found";
  }

  if (isValidAddress && ensName) {
    return "address-resolved";
  }

  return "idle";
}
