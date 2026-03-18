import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import WalletChip from "@workspace/ui/header/components/wallet-chip";

type AppHeaderProps = {
  className?: string;
  onLogoClick: () => void;
  onNavigate: (path: string) => void;
};

export default function AppHeader({
  className,
  onLogoClick,
  onNavigate,
}: AppHeaderProps) {
  return (
    <header className={cn("bg-background", className)}>
      <LayoutContainer className="flex h-14 min-h-0 items-center justify-between">
        <button
          className="flex items-center gap-2"
          type="button"
          onClick={onLogoClick}
        >
          <GhostIcon className="size-7" />
          <span className="text-sm font-semibold">GhostTalkie</span>
        </button>
        <WalletChip onNavigate={onNavigate} />
      </LayoutContainer>
    </header>
  );
}
