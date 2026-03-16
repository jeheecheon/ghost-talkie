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
import { cn } from "@workspace/lib/cn";
import { Circle } from "lucide-react";
import EthereumIcon from "@workspace/ui/icons/ethereum-icon";
import ArbitrumIcon from "@workspace/ui/icons/arbitrum-icon";
import BaseIcon from "@workspace/ui/icons/base-icon";
import OptimismIcon from "@workspace/ui/icons/optimism-icon";
import PolygonIcon from "@workspace/ui/icons/polygon-icon";
import CrossIcon from "@workspace/ui/icons/cross-icon";
import {
  crossMainnet,
  crossTestnet,
} from "@workspace/ui/wallet/constants/chains";

type ChainIconProps = {
  className?: string;
  chainId: number;
};

export default function ChainIcon({ className, chainId }: ChainIconProps) {
  const Icon = getChainIcon(chainId);

  return (
    <div className={cn("size-5", className)}>
      {Icon ? (
        <Icon className="size-full" />
      ) : (
        <Circle className="text-muted-foreground size-full" />
      )}
    </div>
  );

  function getChainIcon(chainId: number) {
    switch (chainId) {
      case mainnet.id:
      case sepolia.id:
        return EthereumIcon;
      case arbitrum.id:
      case arbitrumSepolia.id:
        return ArbitrumIcon;
      case base.id:
      case baseSepolia.id:
        return BaseIcon;
      case optimism.id:
      case optimismSepolia.id:
        return OptimismIcon;
      case polygon.id:
      case polygonAmoy.id:
        return PolygonIcon;
      case crossMainnet.id:
      case crossTestnet.id:
        return CrossIcon;
      default:
        console.error(`Unknown chain id: ${chainId}`);
        return Circle;
    }
  }
}
