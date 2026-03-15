import { useState } from "react";
import { Button } from "@workspace/ui/primitives/button";
import ConfirmModal from "@workspace/ui/primitives/confirm-modal";
import ChatMemberModal from "@workspace/ui/chat/components/chat-member-modal";
import { Menu, Minus, X } from "lucide-react";
import { shortenAddress } from "@workspace/lib/address";
import { cn } from "@workspace/lib/cn";
import type { ViewStatus } from "@workspace/ui/chat/hooks/use-view-status";
import type { Address } from "viem";
import {
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";
import type { Nullable } from "@workspace/types/misc";

type ChatViewHeaderProps = {
  className?: string;
  roomAddress: Address;
  viewStatus: ViewStatus;
  roomState?: Nullable<PrivateChatRoomState>;
  onMinimize: () => void;
  onLeave: () => void;
};

export default function ChatViewHeader({
  className,
  roomAddress,
  viewStatus,
  roomState,
  onMinimize,
  onLeave,
}: ChatViewHeaderProps) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPeerListOpen, setIsPeerListOpen] = useState(false);

  const remotePeers = roomState?.remotePeers ?? [];
  const activePeers = filterPeersByStatus(
    remotePeers,
    PeerStatus.Chatting,
    PeerStatus.Pending,
  );

  const participantCount = activePeers.length + 1;

  return (
    <header
      className={cn(
        "flex items-center justify-between border-b px-4 py-3",
        className,
      )}
    >
      <button
        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
        type="button"
        onClick={() => setIsPeerListOpen(true)}
      >
        <Menu className="size-4" />
        <span className="font-medium">{participantCount}</span>
      </button>

      <div className="flex items-center gap-x-2">
        <div
          className={cn(
            "size-2.5 rounded-full",
            viewStatus === "error"
              ? "bg-red-500"
              : viewStatus === "chatting"
                ? "bg-green-500"
                : "bg-yellow-500",
          )}
        />
        <h2 className="text-sm font-semibold">{shortenAddress(roomAddress)}</h2>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-xs" onClick={onMinimize}>
          <Minus className="size-4" />
        </Button>

        <Button variant="ghost" size="icon-xs" onClick={handleLeaveClick}>
          <X className="size-4" />
        </Button>
      </div>

      <ConfirmModal
        isOpen={isLeaveModalOpen}
        title="Leave Room?"
        description="Are you sure you want to leave this chat room?"
        confirmLabel="Leave"
        onConfirm={handleLeaveConfirm}
        onCancel={handleLeaveCancel}
      />

      {roomState && (
        <ChatMemberModal
          isOpen={isPeerListOpen}
          roomState={roomState}
          onClose={() => setIsPeerListOpen(false)}
        />
      )}
    </header>
  );

  function handleLeaveClick() {
    setIsLeaveModalOpen(true);
  }

  function handleLeaveConfirm() {
    setIsLeaveModalOpen(false);
    onLeave();
  }

  function handleLeaveCancel() {
    setIsLeaveModalOpen(false);
  }
}
