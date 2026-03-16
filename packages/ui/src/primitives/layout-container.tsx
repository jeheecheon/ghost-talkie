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
    <div className={cn("bg-background mx-auto max-w-150 px-4", className)}>
      {children}
    </div>
  );
}
