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
  const { isOpen, activeRoomAddress, rooms, resumeChat } = useChatWidgetStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      activeRoomAddress: s.activeRoomAddress,
      rooms: s.rooms,
      resumeChat: s.resumeChat,
    })),
  );

  const activeRoom = activeRoomAddress
    ? rooms.get(activeRoomAddress)
    : undefined;
  const badgeCount = activeRoom
    ? activeRoom.unreadCount + activeRoom.requestingPeerCount
    : 0;
  const badgeLabel = badgeCount > 99 ? "99+" : badgeCount;

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-150 justify-end px-4">
        <Transition
          className="origin-bottom-right duration-100 ease-out data-closed:scale-50 data-closed:opacity-0"
          as="div"
          show={!isOpen && !!activeRoom}
        >
          <Button
            className={cn(
              "bg-muted text-muted-foreground hover:text-foreground relative rounded-full border shadow-lg backdrop-blur-md dark:backdrop-blur-md",
              className,
            )}
            variant="ghost"
            size="icon-lg"
            onClick={resumeChat}
          >
            <MessageSquareMore className="size-5" />
            {badgeCount > 0 && (
              <span className="bg-destructive absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                {badgeLabel}
              </span>
            )}
          </Button>
        </Transition>
      </div>
    </Portal>
  );
}
