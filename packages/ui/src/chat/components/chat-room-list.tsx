import { MessageSquareMore, Search } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { shortenAddress } from "@workspace/lib/address";
import { Button } from "@workspace/ui/primitives/button";
import AddressAvatar from "@workspace/ui/wallet/components/address-avatar";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import type { ChatRoomEntry } from "@workspace/ui/chat/types";
import type { Address } from "viem";

type ChatRoomListProps = {
  className?: string;
  rooms: ChatRoomEntry[];
  onSelect: (address: Address) => void;
  onSearch: () => void;
};

export default function ChatRoomList({
  className,
  rooms,
  onSelect,
  onSearch,
}: ChatRoomListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {rooms.length === 0 ? (
        <ChatRoomEmpty className="mt-16" onSearch={onSearch} />
      ) : (
        <ul className="space-y-1">
          {rooms.map((room) => (
            <ChatRoomItem
              key={room.roomAddress}
              room={room}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

type ChatRoomItemProps = {
  room: ChatRoomEntry;
  onSelect: (address: Address) => void;
};

function ChatRoomItem({ room, onSelect }: ChatRoomItemProps) {
  const { data: ensProfile } = useEnsProfile({ address: room.roomAddress });
  const totalBadge = room.unreadCount + room.requestingPeerCount;

  return (
    <li
      className="bg-muted hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-colors"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <AddressAvatar className="size-10 shrink-0" address={room.roomAddress} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {ensProfile?.ensName ?? shortenAddress(room.roomAddress)}
        </p>

        {room.lastMessage?.text && (
          <p className="text-muted-foreground truncate text-xs">
            {room.lastMessage.text}
          </p>
        )}
      </div>

      {totalBadge > 0 && (
        <span className="bg-destructive flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
          {totalBadge > 99 ? "99+" : totalBadge}
        </span>
      )}
    </li>
  );

  function handleSelect() {
    onSelect(room.roomAddress);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      onSelect(room.roomAddress);
    }
  }
}

type ChatRoomEmptyProps = {
  className?: string;
  onSearch: () => void;
};

function ChatRoomEmpty({ className, onSearch }: ChatRoomEmptyProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center gap-4",
        className,
      )}
    >
      <MessageSquareMore className="size-12 opacity-40" />
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium">No active chats</p>
        <p className="max-w-60 text-xs">
          Search for a wallet to start a conversation
        </p>
      </div>

      <Button className="gap-2" variant="outline" size="sm" onClick={onSearch}>
        <Search className="size-4" />
        Search wallets
      </Button>
    </div>
  );
}
