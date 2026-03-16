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
  onClose: () => void;
}>;

export default function ResponsiveDialog({
  className,
  isOpen,
  title,
  description,
  children,
  onClose,
}: ResponsiveDialogProps) {
  const layoutMode = useLayoutMode();

  return layoutMode === "desktop" ? (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className={cn("px-4 pb-6", className)}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {children}
      </DrawerContent>
    </Drawer>
  );

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      return;
    }

    onClose();
  }
}
