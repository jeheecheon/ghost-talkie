import type { Address } from "viem";

export type SearchHistoryEntry = {
  address: Address;
  ensName?: string;
  timestamp: number;
};

export type BookmarkEntry = {
  address: Address;
  ensName?: string;
  addedAt: number;
};
