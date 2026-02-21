import { cn } from "@/utils/misc";
import type { PropsWithChildren } from "react";

type LayoutContainerProps = PropsWithChildren<{
  className?: string;
}>;

export default function LayoutContainer({
  className,
  children,
}: LayoutContainerProps) {
  return (
    <div className={cn("mx-auto max-w-150 px-4", className)}>{children}</div>
  );
}
