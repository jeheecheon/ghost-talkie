import { useShallow } from "zustand/react/shallow";
import useKey from "react-use/lib/useKey";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";
import ChatRoomView from "@workspace/ui/chat/components/chat-room-view";
import ChatFAB from "@workspace/ui/chat/components/chat-fab";
import { cn } from "@workspace/lib/cn";

type ChatWidgetProps = {
  className?: string;
};

export default function ChatWidget({ className }: ChatWidgetProps) {
  const { rooms, activeRoomAddress, isOpen, minimize } = useChatWidgetStore(
    useShallow((s) => ({
      rooms: s.rooms,
      activeRoomAddress: s.activeRoomAddress,
      isOpen: s.isOpen,
      minimize: s.minimize,
    })),
  );

  useKey("Escape", minimize, {}, [isOpen, minimize]);

  return (
    <div className={cn(className)}>
      {[...rooms.values()].map((room) => (
        <ChatRoomView
          key={room.roomAddress}
          roomAddress={room.roomAddress}
          chatProof={room.chatProof}
          isOpen={isOpen && room.roomAddress === activeRoomAddress}
        />
      ))}
      <ChatFAB />
    </div>
  );
}
