import type { ReactNode } from "react";
import ConfirmModal from "@workspace/ui/primitives/confirm-modal";
import ConfirmDrawer from "@workspace/ui/primitives/confirm-drawer";
import useLayoutMode from "@workspace/ui/hooks/use-layout-mode";

type ResponsiveConfirmDialogProps = {
  className?: string;
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ResponsiveConfirmDialog(
  props: ResponsiveConfirmDialogProps,
) {
  const layoutMode = useLayoutMode();

  return layoutMode === "desktop" ? (
    <ConfirmModal {...props} />
  ) : (
    <ConfirmDrawer {...props} />
  );
}
