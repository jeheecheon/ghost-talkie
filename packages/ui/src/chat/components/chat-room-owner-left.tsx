import { useEffect, useRef } from "react";
import ChatBubble from "@workspace/ui/chat/components/chat-bubble";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import { cn } from "@workspace/lib/cn";
import { type PrivateChatRoomState } from "@workspace/domain/p2p/types";
import { isAddressEqual } from "viem";
import { Loader2 } from "lucide-react";

type ChatRoomOwnerLeftProps = {
  className?: string;
  roomState: PrivateChatRoomState;
};

export default function ChatRoomOwnerLeft({
  className,
  roomState,
}: ChatRoomOwnerLeftProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomState.messages.length]);

  return (
    <section className={cn("bg-accent flex flex-col", className)}>
      <div className="relative min-h-0 flex-1">
        <GhostIcon className="absolute-center pointer-events-none -mt-10 size-24 opacity-50" />

        <ul className="relative h-full space-y-2 overflow-y-auto p-3">
          {roomState.messages.map((msg) => (
            <li key={msg.id}>
              <ChatBubble
                message={msg}
                isOwn={isAddressEqual(
                  msg.sender,
                  roomState.localPeer.chatProof.signerAddress,
                )}
              />
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Owner left. Waiting for return...
        </p>
      </div>
    </section>
  );
}
