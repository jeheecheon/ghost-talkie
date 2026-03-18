import type { Address } from "viem";
import type { Nullable } from "@workspace/types/misc";
import type { ChatMessage, ChatProof } from "@workspace/domain/p2p/types";

export type ChatRoomEntry = {
  roomAddress: Address;
  chatProof: ChatProof;
  unreadCount: number;
  requestingPeerCount: number;
  lastMessage: Nullable<ChatMessage>;
};
