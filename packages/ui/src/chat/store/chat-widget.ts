import { create } from "zustand";
import { type Address } from "viem";
import type { Nullable } from "@workspace/types/misc";
import type { ChatMessage, ChatProof } from "@workspace/domain/p2p/types";
import type { ChatRoomEntry } from "@workspace/ui/chat/types";

type ChatWidgetState = {
  rooms: Map<Address, ChatRoomEntry>;
  activeRoomAddress: Nullable<Address>;
  isOpen: boolean;
};

type ChatWidgetActions = {
  requestRoom: (address: Address, proof: ChatProof) => void;
  openRoom: (address: Address) => void;
  resumeChat: () => void;
  minimize: () => void;
  leaveRoom: (address: Address) => void;
  incrementUnread: (address: Address) => void;
  setRequestingPeerCount: (address: Address, count: number) => void;
  setLastMessage: (address: Address, message: ChatMessage) => void;
};

type ChatWidgetStore = ChatWidgetState & ChatWidgetActions;

const initialState: ChatWidgetState = {
  rooms: new Map(),
  activeRoomAddress: null,
  isOpen: false,
};

export const useChatWidgetStore = create<ChatWidgetStore>((set, get) => ({
  ...initialState,

  requestRoom: (address, proof) => {
    const { rooms } = get();

    const next = new Map(rooms);
    next.set(address, {
      roomAddress: address,
      chatProof: proof,
      requestingPeerCount: 0,
      lastMessage: null,
      unreadCount: 0,
    });
    set({ rooms: next, activeRoomAddress: address, isOpen: true });
  },

  openRoom: (address) => {
    const { rooms } = get();
    const room = rooms.get(address);
    if (!room) {
      return;
    }

    const next = new Map(rooms);
    next.set(address, { ...room, unreadCount: 0 });
    set({ rooms: next, activeRoomAddress: address, isOpen: true });
  },

  resumeChat: () => {
    const { activeRoomAddress, rooms } = get();
    if (!activeRoomAddress) {
      return;
    }

    const room = rooms.get(activeRoomAddress);
    if (!room) {
      return;
    }

    const next = new Map(rooms);
    next.set(activeRoomAddress, { ...room, unreadCount: 0 });
    set({ rooms: next, isOpen: true });
  },

  minimize: () => {
    set({ isOpen: false });
  },

  leaveRoom: (address) => {
    const { rooms, activeRoomAddress } = get();

    const next = new Map(rooms);
    next.delete(address);

    const updates: Partial<ChatWidgetState> = { rooms: next };
    if (activeRoomAddress === address) {
      updates.activeRoomAddress = null;
      updates.isOpen = false;
    }
    set(updates);
  },

  incrementUnread: (address) => {
    set((state) => {
      const room = state.rooms.get(address);
      if (!room) {
        return state;
      }

      const next = new Map(state.rooms);
      next.set(address, { ...room, unreadCount: room.unreadCount + 1 });
      return { rooms: next };
    });
  },

  setRequestingPeerCount: (address, count) => {
    const { rooms } = get();
    const room = rooms.get(address);
    if (!room) {
      return;
    }

    const next = new Map(rooms);
    next.set(address, { ...room, requestingPeerCount: count });
    set({ rooms: next });
  },

  setLastMessage: (address, message) => {
    const { rooms } = get();
    const room = rooms.get(address);
    if (!room) {
      return;
    }

    const next = new Map(rooms);
    next.set(address, { ...room, lastMessage: message });
    set({ rooms: next });
  },
}));
