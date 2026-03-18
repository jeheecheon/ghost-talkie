import { isAddressEqual, type Address } from "viem";
import {
  PeerRole,
  PeerStatus,
  type ChatMember,
  type PrivateChatRoomState,
  type RemotePeer,
} from "@workspace/domain/p2p/types";

export function determineChatRole(args: {
  signerAddress: Address;
  roomAddress: Address;
}): PeerRole {
  return isAddressEqual(args.signerAddress, args.roomAddress)
    ? PeerRole.Owner
    : PeerRole.Visitor;
}

export function filterPeersByStatus(
  peers: readonly RemotePeer[],
  ...statuses: PeerStatus[]
): RemotePeer[] {
  const statusSet = new Set(statuses);
  return peers.filter((p) => statusSet.has(p.status));
}

export function buildChatMembers(
  roomState: PrivateChatRoomState,
): ChatMember[] {
  const activePeers = filterPeersByStatus(
    roomState.remotePeers,
    PeerStatus.Chatting,
    PeerStatus.Pending,
  );

  return [
    {
      id: "local",
      address: roomState.localPeer.chatProof.signerAddress,
      role: roomState.localPeer.role,
      isMicOn: roomState.localPeer.isMicOn,
      stream: roomState.localPeer.stream,
      isSelf: true,
    },
    ...activePeers.map((peer) => ({
      id: peer.peerId,
      address: peer.chatProof?.signerAddress ?? null,
      role: peer.role,
      isMicOn: peer.isMicOn,
      stream: peer.stream,
      isSelf: false,
    })),
  ];
}
