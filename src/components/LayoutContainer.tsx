import { cn } from "@/utils/misc";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

export default function LayoutContainer({ className, children }: Props) {
  return (
    <div className={cn("mx-auto max-w-150 px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
