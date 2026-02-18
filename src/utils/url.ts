import type { Address } from "viem";

export class AppUrlBuilder {
  static WalletProfile(address: Address) {
    return `/${address}`;
  }

  static Chat(address: Address) {
    return `/${address}/chat`;
  }
}
