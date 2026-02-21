import { create } from "zustand";
import type { Nullable } from "@/types/misc";
import type { NostrIdentity } from "@/types/identity";

type IdentityStore = {
  identity: Nullable<NostrIdentity>;
  isPending: boolean;
  setIdentity: (identity: NostrIdentity) => void;
  setIsPending: (isPending: boolean) => void;
};

export const useIdentityStore = create<IdentityStore>((set) => ({
  identity: null,
  isPending: false,
  setIdentity: (identity) => {
    set({ identity });
  },
  setIsPending: (isPending) => {
    set({ isPending });
  },
}));
