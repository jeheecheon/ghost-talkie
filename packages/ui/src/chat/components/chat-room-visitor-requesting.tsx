import { Loader2, LogOut } from "lucide-react";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";
import useCounter from "react-use/lib/useCounter";
import useInterval from "react-use/lib/useInterval";
import {
  PeerRole,
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { A_SECOND } from "@workspace/lib/time";

type ChatRoomVisitorRequestingProps = {
  className?: string;
  roomState: PrivateChatRoomState;
  onLeave: () => void;
};

export default function ChatRoomVisitorRequesting({
  className,
  roomState: { localPeer, remotePeers },
  onLeave,
}: ChatRoomVisitorRequestingProps) {
  const isWaiting = localPeer.status === PeerStatus.Verifying;
  const TIMEOUT_SECONDS = 120;

  const [remaining, { dec }] = useCounter(TIMEOUT_SECONDS, TIMEOUT_SECONDS, 0);
  useInterval(dec, isWaiting && remaining > 0 ? A_SECOND : null);

  const isTimedOut = isWaiting && remaining <= 0;
  const isTerminal =
    localPeer.status === PeerStatus.Disconnected ||
    localPeer.status === PeerStatus.Rejected ||
    localPeer.status === PeerStatus.Failed;
  const ownerPeer = remotePeers.find((p) => p.role === PeerRole.Owner) ?? null;

  const statusText = (() => {
    if (isTimedOut) {
      return "Owner is not responding";
    }
    if (!ownerPeer) {
      return "Waiting for the host to join...";
    }
    if (localPeer.status === PeerStatus.Rejected) {
      return "The owner declined your request";
    }
    if (localPeer.status === PeerStatus.Failed) {
      return "Connection failed";
    }
    if (
      localPeer.status === PeerStatus.Verifying ||
      localPeer.status === PeerStatus.Requesting
    ) {
      return "Waiting for the owner to let you in...";
    }

    return "Something went wrong";
  })();

  const showLeave = isTimedOut || isTerminal;
  const showRemaining = isWaiting && !isTimedOut;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-y-2 p-6",
        className,
      )}
    >
      <GhostIcon className="size-12" />

      <p className="text-muted-foreground text-sm">{statusText}</p>

      {showRemaining && (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <Loader2 className="size-3 animate-spin" />
          {formatTime(remaining)}
        </p>
      )}

      {showLeave && (
        <Button className="gap-2" variant="outline" size="sm" onClick={onLeave}>
          <LogOut className="size-4" />
          Leave
        </Button>
      )}
    </div>
  );

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
