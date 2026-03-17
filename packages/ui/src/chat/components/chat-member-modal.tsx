import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/primitives/dialog";
import { cn } from "@workspace/lib/cn";
import {
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";
import ChatMemberList from "@workspace/ui/chat/components/chat-member-list";

type ChatMemberModalProps = {
  className?: string;
  isOpen: boolean;
  roomState: PrivateChatRoomState;
  onClose: () => void;
};

export default function ChatMemberModal({
  className,
  isOpen,
  roomState,
  onClose,
}: ChatMemberModalProps) {
  const activePeers = filterPeersByStatus(
    roomState.remotePeers,
    PeerStatus.Chatting,
    PeerStatus.Pending,
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("max-w-xs", className)}
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Participants ({activePeers.length + 1})</DialogTitle>
        </DialogHeader>
        <ChatMemberList roomState={roomState} />
      </DialogContent>
    </Dialog>
  );

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      return;
    }

    onClose();
  }
}
