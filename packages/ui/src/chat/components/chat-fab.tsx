import { MessageSquareMore } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import { Portal, Transition } from "@headlessui/react";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";

type ChatFABProps = {
  className?: string;
};

export default function ChatFAB({ className }: ChatFABProps) {
  const { isOpen, unreadCount, requestingPeerCount, expand } =
    useChatWidgetStore(
      useShallow((s) => ({
        isOpen: s.isOpen,
        unreadCount: s.unreadCount,
        requestingPeerCount: s.requestingPeerCount,
        expand: s.expand,
      })),
    );

  const badgeCount = unreadCount + requestingPeerCount;
  const badgeLabel = badgeCount > 99 ? "99+" : badgeCount;

  return (
    <Portal>
      <Transition
        className="fixed right-4 bottom-4 z-40 origin-bottom-right duration-100 ease-out data-closed:scale-50 data-closed:opacity-0"
        as="div"
        show={!isOpen}
      >
        <Button
          className={cn("relative rounded-full shadow-lg", className)}
          size="icon-lg"
          onClick={expand}
        >
          <MessageSquareMore className="size-5" />
          {badgeCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold">
              {badgeLabel}
            </span>
          )}
        </Button>
      </Transition>
    </Portal>
  );
}
