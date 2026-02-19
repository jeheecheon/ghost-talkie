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
