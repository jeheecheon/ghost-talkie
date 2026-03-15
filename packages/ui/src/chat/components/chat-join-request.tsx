import { Check, X } from "lucide-react";
import { Button } from "@workspace/ui/primitives/button";
import { shortenAddress } from "@workspace/lib/address";
import { cn } from "@workspace/lib/cn";
import type { RemotePeer } from "@workspace/domain/p2p/types";

type ChatJoinRequestProps = {
  className?: string;
  peer: RemotePeer;
  onAccept: (peerId: string) => void;
  onReject: (peerId: string) => void;
};

export default function ChatJoinRequest({
  className,
  peer,
  onAccept,
  onReject,
}: ChatJoinRequestProps) {
  return (
    <div
      className={cn(
        "bg-muted flex items-center justify-between rounded-lg p-3",
        className,
      )}
    >
      <p className="text-sm">
        <span className="font-medium">
          {peer.chatProof
            ? shortenAddress(peer.chatProof.signerAddress)
            : peer.peerId.slice(0, 10)}
        </span>
        <span className="text-muted-foreground"> wants to join</span>
      </p>

      <div className="space-x-1">
        <Button variant="ghost" size="icon-xs" onClick={handleAccept}>
          <Check className="size-4" />
        </Button>

        <Button variant="ghost" size="icon-xs" onClick={handleReject}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );

  function handleAccept() {
    onAccept(peer.peerId);
  }

  function handleReject() {
    onReject(peer.peerId);
  }
}
