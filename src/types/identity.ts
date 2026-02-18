import type { Address, Hex } from "viem";

export type DerivedIdentity = {
  privateKey: Uint8Array;
  publicKey: string;
  walletAddress: Address;
};

export type NostrIdentity = DerivedIdentity & {
  proofSig: Hex;
};
