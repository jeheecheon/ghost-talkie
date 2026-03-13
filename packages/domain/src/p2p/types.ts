import type { Address, Hex } from "viem";
import type { Nullable } from "@workspace/types/misc";

export enum RoomStatus {
  Waiting = "waiting",
  Active = "active",
}
export enum RoomAction {
  Proof = "proof",
  Request = "request",
  Response = "response",
  Message = "message",
}

export enum PeerStatus {
  Verifying = "verifying",
  Requesting = "requesting",
  Pending = "pending",
  Chatting = "chatting",
  Rejected = "rejected",
  Failed = "failed",
  Disconnected = "disconnected",
}
export enum PeerRole {
  Owner = "owner",
  Visitor = "visitor",
  Unknown = "unknown",
}

export type ChatMessagePayload = {
  text: string;
  sender: Address;
};
export type ChatRequestPayload = Record<string, never>;
export type ChatResponsePayload = {
  accepted: boolean;
  targetPeerId: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: Address;
  timestamp: number;
};
export type ChatProof = {
  signerAddress: Address;
  roomAddress: Address;
  timestamp: number;
  signature: Hex;
};

export type LocalPeer = {
  peerId: string;
  role: PeerRole;
  status: PeerStatus;
  chatProof: ChatProof;
};

export type RemotePeer = {
  peerId: string;
  role: PeerRole;
  status: PeerStatus;
  chatProof: Nullable<ChatProof>;
};

export type PrivateChatRoomState = {
  localPeer: LocalPeer;
  status: RoomStatus;
  messages: readonly ChatMessage[];
  remotePeers: RemotePeer[];
};
