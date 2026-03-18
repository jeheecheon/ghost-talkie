import { cn } from "@workspace/lib/cn";
import type { PropsWithChildren } from "react";

type LayoutContainerProps = PropsWithChildren<{
  className?: string;
  gutters?: boolean;
  clearance?: boolean;
}>;

export default function LayoutContainer({
  className,
  gutters = true,
  clearance = true,
  children,
}: LayoutContainerProps) {
  return (
    <div
      className={cn(
        "bg-background border-x-border mx-auto min-h-dvh max-w-150 border-x not-dark:shadow-sm",
        gutters && "px-8",
        clearance && "pt-20 pb-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
