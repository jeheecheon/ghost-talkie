import type { Maybe } from "@/types/misc";
import type { Address, Hex } from "viem";

export type DerivedIdentity = {
  privateKey: Uint8Array;
  publicKey: string;
  walletAddress: Address;
};

export type NostrIdentity = DerivedIdentity & {
  proofSig: Hex;
};

export type EnsIdentity = {
  address: Address;
  ensName: Maybe<string>;
  avatar: Maybe<string>;
};
