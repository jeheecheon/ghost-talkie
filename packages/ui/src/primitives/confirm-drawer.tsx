import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/primitives/drawer";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import type { ReactNode } from "react";

type ConfirmDrawerProps = {
  className?: string;
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDrawer({
  className,
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className={cn("px-4 pb-6", className)}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <DrawerDescription className="px-4">{description}</DrawerDescription>

        <DrawerFooter>
          <Button onClick={onConfirm}>{confirmLabel}</Button>

          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  function handleOpenChange(open: boolean) {
    if (open) {
      return;
    }

    onClose();
  }
}
