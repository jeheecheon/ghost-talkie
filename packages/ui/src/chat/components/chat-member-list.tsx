import { Crown, Mic, MicOff } from "lucide-react";
import { shortenAddress } from "@workspace/lib/address";
import EnsAvatar from "@workspace/ui/wallet/components/address-avatar";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import useVoiceActivity from "@workspace/ui/chat/hooks/use-voice-activity";
import { cn } from "@workspace/lib/cn";
import {
  PeerRole,
  PeerStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import { filterPeersByStatus } from "@workspace/domain/p2p/chat";
import type { Nullable } from "@workspace/types/misc";
import type { Address } from "viem";

type ChatMemberListProps = {
  className?: string;
  roomState: PrivateChatRoomState;
};

export default function ChatMemberList({
  className,
  roomState,
}: ChatMemberListProps) {
  const activePeers = filterPeersByStatus(
    roomState.remotePeers,
    PeerStatus.Chatting,
    PeerStatus.Pending,
  );

  return (
    <aside
      className={cn("bg-background space-y-3.5 overflow-hidden p-3", className)}
    >
      <ChatMemberRow
        address={roomState.localPeer.chatProof.signerAddress}
        role={roomState.localPeer.role}
        isMicOn={roomState.localPeer.isMicOn}
        stream={roomState.localPeer.stream}
        isSelf
      />
      {activePeers.map((peer) => (
        <ChatMemberRow
          key={peer.peerId}
          address={peer.chatProof?.signerAddress ?? null}
          role={peer.role}
          isMicOn={peer.isMicOn}
          stream={peer.stream}
          isSelf={false}
        />
      ))}
    </aside>
  );
}

type ChatMemberRowProps = {
  address: Nullable<Address>;
  role: PeerRole;
  isMicOn: boolean;
  stream: Nullable<MediaStream>;
  isSelf: boolean;
};

function ChatMemberRow({
  address,
  role,
  isMicOn,
  stream,
  isSelf,
}: ChatMemberRowProps) {
  const { data: ensProfile } = useEnsProfile({ address, enabled: !!address });
  const { isSpeaking } = useVoiceActivity(stream);

  return (
    <div className="flex items-center gap-x-2">
      <EnsAvatar
        className={cn("shrink-0", isSpeaking && "ring-2 ring-green-500")}
        address={address}
      />

      <span className="min-w-0 truncate text-xs font-medium">
        {getDisplayName()}
      </span>

      {role === PeerRole.Owner && (
        <Crown className="size-4 shrink-0 text-yellow-500" />
      )}

      <div className="ml-auto">
        {isMicOn ? (
          <Mic className="size-3.5 shrink-0 text-green-500" />
        ) : (
          <MicOff className="text-muted-foreground size-3.5 shrink-0" />
        )}
      </div>
    </div>
  );

  function getDisplayName() {
    if (isSelf) {
      return "You";
    }

    if (ensProfile?.ensName) {
      return ensProfile.ensName;
    }

    if (address) {
      return shortenAddress(address);
    }

    return "Unknown";
  }
}
