import type { Address } from "viem";

export class AppUrlBuilder {
  static WalletProfile(address: Address) {
    return `/${address}`;
  }
}
