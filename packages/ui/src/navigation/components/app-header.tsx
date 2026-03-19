import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import ThemeToggle from "@workspace/ui/primitives/theme-toggle";
import WalletChip from "@workspace/ui/wallet/components/wallet-chip";

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
      <LayoutContainer
        className="dark:bg-floating border-border flex h-14 min-h-0 items-center justify-between border-b px-6 pl-7"
        clearance={false}
        gutters={false}
      >
        <button
          className="flex items-center gap-2"
          type="button"
          onClick={onLogoClick}
        >
          <GhostIcon className="size-7" />
          <span className="text-sm font-semibold">GhostTalkie</span>
        </button>
        <div className="flex items-center">
          <ThemeToggle />
          <WalletChip onNavigate={onNavigate} />
        </div>
      </LayoutContainer>
    </header>
  );
}
