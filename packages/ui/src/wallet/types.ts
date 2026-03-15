import type { Maybe } from "@workspace/types/misc";
import type { Address } from "viem";

export type EnsProfile = {
  address: Maybe<Address>;
  ensName: Maybe<string>;
  avatar: Maybe<string>;
};
