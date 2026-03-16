import { cn } from "@workspace/lib/cn";
import type { PropsWithChildren } from "react";

type LayoutContainerProps = PropsWithChildren<{
  className?: string;
}>;

export default function LayoutContainer({
  className,
  children,
}: LayoutContainerProps) {
  return (
    <div
      className={cn(
        "bg-background border-x-border mx-auto min-h-dvh max-w-150 border-x px-8 not-dark:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
