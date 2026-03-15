import { useMemo } from "react";
import type { Nullable } from "@workspace/types/misc";
import {
  PeerRole,
  PeerStatus,
  RoomStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";

export type ViewStatus =
  | "owner-waiting"
  | "visitor-pending"
  | "error"
  | "chatting";

const VISITOR_PENDING_STATUSES = new Set([
  PeerStatus.Verifying,
  PeerStatus.Pending,
  PeerStatus.Disconnected,
]);

const ERROR_PEER_STATUSES = new Set([
  PeerStatus.Disconnected,
  PeerStatus.Failed,
  PeerStatus.Rejected,
]);

export default function useViewStatus(
  roomState: Nullable<PrivateChatRoomState>,
): ViewStatus {
  return useMemo(() => deriveViewStatus(roomState), [roomState]);
}

function deriveViewStatus(state: Nullable<PrivateChatRoomState>): ViewStatus {
  if (!state) {
    return "chatting";
  }

  if (ERROR_PEER_STATUSES.has(state.localPeer.status)) {
    return "error";
  }

  const isOwnerEmpty =
    state.status === RoomStatus.Empty &&
    state.localPeer.role === PeerRole.Owner;

  if (isOwnerEmpty) {
    return "owner-waiting";
  }

  const isVisitorPending =
    state.localPeer.role === PeerRole.Visitor &&
    VISITOR_PENDING_STATUSES.has(state.localPeer.status);

  if (isVisitorPending) {
    return "visitor-pending";
  }

  return "chatting";
}
