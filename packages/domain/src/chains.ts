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
import { defineChain } from "viem";

export const crossMainnet = defineChain({
  id: 612055,
  name: "CROSS Mainnet",
  nativeCurrency: { name: "CROSS", symbol: "CROSS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.crosstoken.io:22001"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://www.crossscan.io" },
  },
});

export const crossTestnet = defineChain({
  id: 612044,
  name: "CROSS Testnet",
  nativeCurrency: { name: "CROSS", symbol: "CROSS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.crosstoken.io:22001"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://testnet.crossscan.io" },
  },
  testnet: true,
});

export const MAINNET_CHAINS = [
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  crossMainnet,
] as const;

export const TESTNET_CHAINS = [
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  crossTestnet,
] as const;

export const SUPPORTED_CHAINS = (process.env.ENABLED_FEATURES ?? "")
  .split(",")
  .includes("testnet")
  ? TESTNET_CHAINS
  : MAINNET_CHAINS;
