import { create } from "zustand";
import type { Address } from "viem";
import type { Nullable } from "@workspace/types/misc";
import type { ChatProof } from "@workspace/domain/p2p/types";
import { isAddressEqual } from "viem/utils";

type ChatWidgetState = {
  isOpen: boolean;
  roomAddress: Nullable<Address>;
  chatProof: Nullable<ChatProof>;
  pendingRoomAddress: Nullable<Address>;
  pendingChatProof: Nullable<ChatProof>;
  unreadCount: number;
  requestingPeerCount: number;
};

type ChatWidgetActions = {
  expand: () => void;
  requestRoom: (address: Address, proof: ChatProof) => void;
  confirmRoomSwitch: () => void;
  cancelRoomSwitch: () => void;
  minimize: () => void;
  leaveRoom: () => void;
  incrementUnread: () => void;
  setRequestingPeerCount: (count: number) => void;
};

type ChatWidgetStore = ChatWidgetState & ChatWidgetActions;

const initialState: ChatWidgetState = {
  isOpen: false,
  roomAddress: null,
  chatProof: null,
  pendingRoomAddress: null,
  pendingChatProof: null,
  unreadCount: 0,
  requestingPeerCount: 0,
};

export const useChatWidgetStore = create<ChatWidgetStore>((set, get) => ({
  ...initialState,

  expand: () => {
    set({ isOpen: true, unreadCount: 0 });
  },

  requestRoom: (address, proof) => {
    const { roomAddress } = get();
    if (roomAddress && !isAddressEqual(roomAddress, address)) {
      set({ pendingRoomAddress: address, pendingChatProof: proof });
      return;
    }

    set({ isOpen: true, roomAddress: address, chatProof: proof });
  },

  confirmRoomSwitch: () => {
    const { pendingRoomAddress, pendingChatProof } = get();
    if (!pendingRoomAddress || !pendingChatProof) {
      return;
    }

    set({
      isOpen: true,
      roomAddress: pendingRoomAddress,
      chatProof: pendingChatProof,
      pendingRoomAddress: null,
      pendingChatProof: null,
      unreadCount: 0,
      requestingPeerCount: 0,
    });
  },

  cancelRoomSwitch: () => {
    set({ pendingRoomAddress: null, pendingChatProof: null });
  },

  minimize: () => {
    set({ isOpen: false });
  },

  leaveRoom: () => {
    set(initialState);
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  setRequestingPeerCount: (count) => {
    set({ requestingPeerCount: count });
  },
}));
