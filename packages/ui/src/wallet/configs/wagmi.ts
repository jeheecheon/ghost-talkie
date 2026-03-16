import {
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
} from "viem/chains";
import { http, createConfig, type Transport } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { ENV } from "@workspace/ui/configs/env";

const MAINNET_CHAINS = [mainnet, arbitrum, base, optimism, polygon] as const;
const TESTNET_CHAINS = [
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
] as const;

export const SUPPORTED_CHAINS = ENV.ENABLED_FEATURES.includes("testnet")
  ? TESTNET_CHAINS
  : MAINNET_CHAINS;

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
