import { useShallow } from "zustand/react/shallow";
import { cn } from "@workspace/lib/cn";
import ChatRoomList from "@workspace/ui/chat/components/chat-room-list";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";
import type { Address } from "viem";

type ChatRoomSectionProps = {
  className?: string;
  onSearch: () => void;
};

export default function ChatRoomSection({
  className,
  onSearch,
}: ChatRoomSectionProps) {
  const { rooms, openRoom } = useChatWidgetStore(
    useShallow((s) => ({
      rooms: s.rooms,
      openRoom: s.openRoom,
    })),
  );

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-lg font-bold">Chats</h2>
      <ChatRoomList
        rooms={[...rooms.values()]}
        onSelect={handleSelectRoom}
        onSearch={onSearch}
      />
    </section>
  );

  function handleSelectRoom(address: Address) {
    openRoom(address);
  }
}
