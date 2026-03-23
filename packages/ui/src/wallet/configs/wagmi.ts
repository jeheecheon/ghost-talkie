import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "@workspace/domain/wallet/chains";
import type { HttpTransport } from "viem";

const transports = SUPPORTED_CHAINS.reduce<Record<number, HttpTransport>>(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {},
);

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [injected()],
  transports,
});
