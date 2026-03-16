import { isAddressEqual, type Address } from "viem";
import {
  PeerRole,
  type PeerStatus,
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
