import type { Address } from "viem";
import type { Nullable } from "@/types/misc";

export interface ResolvedIdentity {
  address: Nullable<Address>;
  ensName: Nullable<string>;
  avatar: Nullable<string>;
}
