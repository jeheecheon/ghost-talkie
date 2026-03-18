import { useEffect, useRef } from "react";
import ChatJoinRequest from "@workspace/ui/chat/components/chat-join-request";
import ChatMemberList from "@workspace/ui/chat/components/chat-member-list";
import { buildChatMembers } from "@workspace/domain/p2p/chat";
import ChatBubble from "@workspace/ui/chat/components/chat-bubble";
import ChatComposer from "@workspace/ui/chat/components/chat-composer";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import { cn } from "@workspace/lib/cn";
import {
  PeerRole,
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";
import type { LayoutMode } from "@workspace/types/ui";
import { isAddressEqual } from "viem";

type ChatRoomContentProps = {
  className?: string;
  layout: LayoutMode;
  roomState: PrivateChatRoomState;
  onRespond: (peerId: string, accepted: boolean) => Promise<void>;
  onSendMessage: (text: string) => Promise<void>;
  onToggleMic: () => Promise<void>;
};

export default function ChatRoomContent({
  className,
  layout,
  roomState,
  onRespond,
  onSendMessage,
  onToggleMic,
}: ChatRoomContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomState.messages.length]);

  const isOwner = roomState.localPeer.role === PeerRole.Owner;
  const requestingPeers = filterPeersByStatus(
    roomState.remotePeers,
    PeerStatus.Requesting,
  );
  const chatMembers = buildChatMembers(roomState);

  return (
    <section className={cn("bg-accent flex", className)}>
      {layout === "desktop" && (
        <div className="relative z-10 w-12">
          <ChatMemberList
            className="border-border absolute inset-y-0 w-12 border-r transition-[width] hover:w-48"
            members={chatMembers}
          />
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        <GhostIcon className="absolute-center pointer-events-none -mt-10 size-24 opacity-50" />

        <ul className="relative space-y-2 px-3 pt-2">
          {isOwner &&
            requestingPeers.map((peer) => (
              <li key={peer.peerId}>
                <ChatJoinRequest
                  peer={peer}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </li>
            ))}
        </ul>

        <ul className="relative min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
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

        <ChatComposer
          isMicOn={roomState.localPeer.isMicOn}
          onSend={handleSend}
          onToggleMic={onToggleMic}
        />
      </div>
    </section>
  );

  function handleAccept(peerId: string) {
    onRespond(peerId, true);
  }

  function handleReject(peerId: string) {
    onRespond(peerId, false);
  }

  function handleSend(text: string) {
    onSendMessage(text);
  }
}
