import type { ComponentType } from "react";
import { cn } from "@workspace/lib/cn";
import EthereumIcon from "./ethereum-icon";
import ArbitrumIcon from "./arbitrum-icon";
import BaseIcon from "./base-icon";
import OptimismIcon from "./optimism-icon";
import PolygonIcon from "./polygon-icon";

const CHAIN_ICONS: Record<number, ComponentType<{ className?: string }>> = {
  1: EthereumIcon,
  42161: ArbitrumIcon,
  8453: BaseIcon,
  10: OptimismIcon,
  137: PolygonIcon,
};

type ChainIconProps = {
  className?: string;
  chainId: number;
};

export default function ChainIcon({ className, chainId }: ChainIconProps) {
  const Icon = CHAIN_ICONS[chainId];

  // TODO: render fallback
  return Icon ? <Icon className={cn("size-5", className)} /> : null;
}
