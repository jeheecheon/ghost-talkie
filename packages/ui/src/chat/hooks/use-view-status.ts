import { useMemo } from "react";
import type { Nullable } from "@workspace/types/misc";
import {
  PeerRole,
  PeerStatus,
  RoomStatus,
  type PrivateChatRoomState,
} from "@workspace/domain/p2p/types";

export type ViewStatus =
  | "connecting"
  | "owner-waiting"
  | "owner-left"
  | "visitor-requesting"
  | "error"
  | "chatting";

const VISITOR_REQUESTING_STATUSES = new Set([
  PeerStatus.Verifying,
  PeerStatus.Requesting,
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
    return "connecting";
  }

  if (ERROR_PEER_STATUSES.has(state.localPeer.status)) {
    return "error";
  }

  if (state.status === RoomStatus.OwnerLeft) {
    return "owner-left";
  }

  const isOwnerEmpty =
    state.status === RoomStatus.Empty &&
    state.localPeer.role === PeerRole.Owner;

  if (isOwnerEmpty) {
    return "owner-waiting";
  }

  const isVisitorRequesting =
    state.localPeer.role === PeerRole.Visitor &&
    VISITOR_REQUESTING_STATUSES.has(state.localPeer.status);

  if (isVisitorRequesting) {
    return "visitor-requesting";
  }

  return "chatting";
}
