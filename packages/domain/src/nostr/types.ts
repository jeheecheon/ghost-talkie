import type { Maybe } from "@workspace/types/misc";
import type { Address, Hex } from "viem";

export type Comment = {
  id: string;
  content: string;
  nostrPubkey: string;
  walletAddress: Address;
  proofSig: Hex;
  createdAt: number;
  isVerified: boolean;
};

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

export type NostrConfig = {
  relays: string[];
  topicPrefix: string;
};
