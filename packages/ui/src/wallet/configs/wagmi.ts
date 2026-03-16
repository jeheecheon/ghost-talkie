import { http, type Transport } from "viem";
import { createConfig } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "@workspace/ui/wallet/constants/chains";

const transports = SUPPORTED_CHAINS.reduce<Record<number, Transport>>(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {},
);

export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [metaMask()],
  transports,
});
