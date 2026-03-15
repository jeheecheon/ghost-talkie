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
};

type ChatWidgetActions = {
  expand: () => void;
  requestRoom: (address: Address, proof: ChatProof) => void;
  confirmRoomSwitch: () => void;
  cancelRoomSwitch: () => void;
  minimize: () => void;
  leaveRoom: () => void;
};

type ChatWidgetStore = ChatWidgetState & ChatWidgetActions;

const initialState: ChatWidgetState = {
  isOpen: false,
  roomAddress: null,
  chatProof: null,
  pendingRoomAddress: null,
  pendingChatProof: null,
};

export const useChatWidgetStore = create<ChatWidgetStore>((set, get) => ({
  ...initialState,

  expand: () => {
    set({ isOpen: true });
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
}));
