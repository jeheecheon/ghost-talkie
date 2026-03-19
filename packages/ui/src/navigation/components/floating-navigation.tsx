import type { ReactNode } from "react";
import { cn } from "@workspace/lib/cn";

export type FloatingTabItem = {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

type FloatingNavigationProps = {
  className?: string;
  tabs: FloatingTabItem[];
};

export default function FloatingNavigation({
  className,
  tabs,
}: FloatingNavigationProps) {
  return (
    <nav
      className={cn(
        "border-border bg-muted fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-x-2 rounded-full border px-2 py-1 shadow-lg not-dark:shadow-xl dark:backdrop-blur-md",
        className,
      )}
      aria-label="Main navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full py-3 transition-all duration-200",
            tab.isActive
              ? "bg-floating text-foreground px-5"
              : "text-muted-foreground hover:text-foreground px-4",
          )}
          onClick={tab.onClick}
        >
          <div className="shrink-0">{tab.icon}</div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              tab.isActive ? "ml-2 max-w-20 opacity-100" : "max-w-0 opacity-0",
            )}
            aria-hidden={!tab.isActive}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {tab.label}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
}
