import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Address } from "viem";
import ChatViewHeader from "@workspace/ui/chat/components/chat-view-header";
import ChatRoomContent from "@workspace/ui/chat/components/chat-room-content";
import ChatRoomOwnerWaiting from "@workspace/ui/chat/components/chat-room-owner-waiting";
import ChatRoomConnecting from "@workspace/ui/chat/components/chat-room-connecting";
import ChatRoomVisitorRequesting from "@workspace/ui/chat/components/chat-room-visitor-requesting";
import ChatRoomOwnerLeft from "@workspace/ui/chat/components/chat-room-owner-left";
import usePrivateChatRoom from "@workspace/ui/chat/hooks/use-private-chat-room";
import useNotificationSound from "@workspace/ui/chat/hooks/use-notification-sound";
import useViewStatus from "@workspace/ui/chat/hooks/use-view-status";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";
import { cn } from "@workspace/lib/cn";
import {
  PeerStatus,
  type ChatMessage,
  type ChatProof,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import { Portal, Transition } from "@headlessui/react";
import useLockBodyScroll from "react-use/lib/useLockBodyScroll";
import useLayoutMode from "@workspace/ui/hooks/use-layout-mode";
import useVisualViewportHeight from "@workspace/ui/hooks/use-visual-viewport-height";
import { ENV } from "@workspace/ui/configs/env";

type ChatRoomViewProps = {
  className?: string;
  roomAddress: Address;
  chatProof: ChatProof;
  isOpen: boolean;
};

export default function ChatRoomView({
  className,
  roomAddress,
  chatProof,
  isOpen,
}: ChatRoomViewProps) {
  const layout = useLayoutMode();
  const {
    minimize,
    leaveRoom,
    incrementUnread,
    setRequestingPeerCount,
    setLastMessage,
  } = useChatWidgetStore(
    useShallow((s) => ({
      minimize: s.minimize,
      leaveRoom: s.leaveRoom,
      incrementUnread: s.incrementUnread,
      setRequestingPeerCount: s.setRequestingPeerCount,
      setLastMessage: s.setLastMessage,
    })),
  );

  useLockBodyScroll(layout === "mobile" && isOpen);

  const viewportHeight = useVisualViewportHeight(layout === "mobile");
  const { playNotification } = useNotificationSound({
    url: ENV.NOTIFICATION_SOUND_URL,
  });

  const { roomState, respond, sendMessage, toggleMic, disableMic } =
    usePrivateChatRoom({
      chatProof,
      audioEnabled: isOpen,
      onMessage: (message: ChatMessage) => {
        setLastMessage(roomAddress, message);

        if (message.sender !== chatProof.signerAddress) {
          playNotification();
        }

        if (isOpen) {
          return;
        }

        incrementUnread(roomAddress);
      },
      onRemotePeersChange: (remotePeers, isOwner) => {
        if (!isOwner) {
          return;
        }

        const requestingPeers = filterPeersByStatus(
          remotePeers,
          PeerStatus.Requesting,
        );
        setRequestingPeerCount(roomAddress, requestingPeers.length);
      },
    });

  const viewStatus = useViewStatus(roomState);

  useEffect(() => {
    if (!isOpen) {
      disableMic();
    }
  }, [isOpen, disableMic]);

  return (
    <Portal>
      <Transition
        className={cn(
          "z-40 transition ease-out data-closed:opacity-0",
          layout === "mobile" &&
            "fixed top-0 left-0 w-full duration-200 data-closed:translate-x-2",
          layout === "desktop" &&
            "fixed right-4 bottom-4 h-[calc(100%-2rem)] max-h-140 w-[calc(100%-2rem)] max-w-90 origin-bottom-right overflow-hidden rounded-2xl border shadow-xl duration-100 data-closed:scale-95",
          className,
        )}
        style={layout === "mobile" ? { height: viewportHeight } : undefined}
        show={isOpen}
        as="div"
      >
        <LayoutContainer
          className="flex h-full min-h-0 flex-col"
          clearance={false}
          gutters={false}
        >
          <ChatViewHeader
            roomAddress={roomAddress}
            viewStatus={viewStatus}
            roomState={roomState}
            onMinimize={minimize}
            onLeave={handleLeave}
          />

          {viewStatus === "connecting" || !roomState ? (
            <ChatRoomConnecting className="min-h-0 flex-1" />
          ) : viewStatus === "owner-waiting" ? (
            <ChatRoomOwnerWaiting
              className="min-h-0 flex-1"
              roomState={roomState}
              onRespond={respond}
            />
          ) : viewStatus === "visitor-requesting" || viewStatus === "error" ? (
            <ChatRoomVisitorRequesting
              className="min-h-0 flex-1"
              roomState={roomState}
              onLeave={handleLeave}
            />
          ) : viewStatus === "owner-left" ? (
            <ChatRoomOwnerLeft
              className="min-h-0 flex-1"
              roomState={roomState}
            />
          ) : (
            <ChatRoomContent
              className="min-h-0 flex-1"
              layout={layout}
              roomState={roomState}
              onRespond={respond}
              onSendMessage={sendMessage}
              onToggleMic={toggleMic}
            />
          )}
        </LayoutContainer>
      </Transition>
    </Portal>
  );

  function handleLeave() {
    leaveRoom(roomAddress);
  }
}
