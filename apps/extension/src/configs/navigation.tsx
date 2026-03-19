import { MessageSquare, User } from "lucide-react";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import type { Address } from "viem";
import type { ReactNode } from "react";
import type { View } from "@/stores/navigation";
import { Optional } from "@workspace/types/misc";

export type FloatingTabConfig = {
  icon: ReactNode;
  label: string;
  view: View;
  isActive: (currentView: View, localAddress: Optional<Address>) => boolean;
};

export const NAV_MENUS: FloatingTabConfig[] = [
  {
    icon: <MessageSquare className="size-6" />,
    label: "Chat",
    view: "chat",
    isActive: (currentView) => currentView === "chat",
  },
  {
    icon: <GhostIcon className="size-9" />,
    label: "Home",
    view: "home",
    isActive: (currentView) => currentView === "home",
  },
  {
    icon: <User className="size-6" />,
    label: "Profile",
    view: "profile",
    isActive: (currentView, localAddress) =>
      currentView === "profile" && !!localAddress,
  },
];
