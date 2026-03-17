import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import ChatJoinRequest from "@workspace/ui/chat/components/chat-join-request";
import ShareButton from "@workspace/ui/chat/components/share-button";
import {
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";

type ChatRoomOwnerWaitingProps = {
  className?: string;
  roomState: PrivateChatRoomState;
  onRespond: (peerId: string, accepted: boolean) => Promise<void>;
};

export default function ChatRoomOwnerWaiting({
  className,
  roomState,
  onRespond,
}: ChatRoomOwnerWaitingProps) {
  const requestingPeers = filterPeersByStatus(
    roomState.remotePeers,
    PeerStatus.Requesting,
  );

  return (
    <div className={cn("relative", className)}>
      <div className="absolute-center flex w-full flex-col items-center justify-center gap-y-4">
        <GhostIcon className="size-16" />

        <p className="text-muted-foreground text-center text-sm">
          Waiting for a ghost to arrive...
        </p>

        <ShareButton>Share room link</ShareButton>
      </div>

      {requestingPeers.length > 0 && (
        <ul className="relative w-full space-y-2 px-3 pt-2">
          {requestingPeers.map((peer) => (
            <li key={peer.peerId}>
              <ChatJoinRequest
                peer={peer}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  function handleAccept(peerId: string) {
    onRespond(peerId, true);
  }

  function handleReject(peerId: string) {
    onRespond(peerId, false);
  }
}
