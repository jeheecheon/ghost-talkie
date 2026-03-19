import { matchPath } from "react-router";
import { MessageSquare, User } from "lucide-react";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import type { FloatingTabItem } from "@workspace/ui/navigation/components/floating-navigation";
import type { Address } from "viem";

type FloatingTabConfig = Omit<FloatingTabItem, "isActive" | "onClick"> & {
  pattern: string;
  isActive: (path: string, localAddress: Address | undefined) => boolean;
};

export const NAV_MENUS: FloatingTabConfig[] = [
  {
    icon: <MessageSquare className="size-6" />,
    label: "Chat",
    pattern: "/chat",
    isActive: (path) => !!matchPath("/chat", path),
  },
  {
    icon: <GhostIcon className="size-9" />,
    label: "Home",
    pattern: "/",
    isActive: (path) => !!matchPath("/", path),
  },
  {
    icon: <User className="size-6" />,
    label: "Profile",
    pattern: "/:address",
    isActive: (path, localAddress) => {
      if (!localAddress) {
        return false;
      }

      const match = matchPath("/:address", path);

      return (
        !!match &&
        match.params.address?.toLowerCase() === localAddress.toLowerCase()
      );
    },
  },
];
