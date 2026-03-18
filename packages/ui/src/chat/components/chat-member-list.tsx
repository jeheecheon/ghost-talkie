import { Crown, Mic, MicOff } from "lucide-react";
import { shortenAddress } from "@workspace/lib/address";
import EnsAvatar from "@workspace/ui/wallet/components/address-avatar";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import useVoiceActivity from "@workspace/ui/chat/hooks/use-voice-activity";
import { cn } from "@workspace/lib/cn";
import { PeerRole } from "@workspace/domain/p2p/types";
import type { ChatMember } from "@workspace/domain/p2p/types";
import type { Nullable } from "@workspace/types/misc";
import type { Address } from "viem";

type ChatMemberListProps = {
  className?: string;
  members: ChatMember[];
};

export default function ChatMemberList({
  className,
  members,
}: ChatMemberListProps) {
  return (
    <ul
      className={cn("bg-background space-y-3.5 overflow-hidden p-3", className)}
    >
      {members.map((member) => (
        <li key={member.id}>
          <ChatMemberRow
            address={member.address}
            role={member.role}
            isMicOn={member.isMicOn}
            stream={member.stream}
            isSelf={member.isSelf}
          />
        </li>
      ))}
    </ul>
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
    <div className="flex items-center gap-x-2" title={address ?? undefined}>
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
