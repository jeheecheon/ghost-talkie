import type { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/primitives/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/primitives/drawer";
import { cn } from "@workspace/lib/cn";
import useLayoutMode from "@workspace/ui/hooks/use-layout-mode";

type ResponsiveDialogProps = PropsWithChildren<{
  className?: string;
  isOpen: boolean;
  title: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
}>;

export default function ResponsiveDialog({
  className,
  isOpen,
  title,
  description,
  children,
  onOpenChange,
}: ResponsiveDialogProps) {
  const layoutMode = useLayoutMode();

  return layoutMode === "desktop" ? (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={cn("px-4 pb-6", className)}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {children}
      </DrawerContent>
    </Drawer>
  );
}
