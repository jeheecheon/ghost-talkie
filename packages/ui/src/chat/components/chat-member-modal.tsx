import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/primitives/dialog";
import { cn } from "@workspace/lib/cn";
import type { PrivateChatRoomState } from "@workspace/domain/p2p/types";
import ChatMemberList from "@workspace/ui/chat/components/chat-member-list";
import { buildChatMembers } from "@workspace/domain/p2p/chat";

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
  const chatMembers = buildChatMembers(roomState);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("max-w-xs", className)}
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Participants ({chatMembers.length})</DialogTitle>
        </DialogHeader>
        <ChatMemberList members={chatMembers} />
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
