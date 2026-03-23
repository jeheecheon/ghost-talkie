import { create } from "zustand";
import type { Address } from "viem";
import type { Nullable } from "@workspace/types/misc";

export type View = "home" | "chat" | "profile";

type NavigationStore = {
  view: View;
  profileAddress: Nullable<Address>;
  navigate: (view: View) => void;
  navigateToProfile: (address: Address) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  view: "home",
  profileAddress: null,
  navigate: (view) => set({ view }),
  navigateToProfile: (address) =>
    set({ view: "profile", profileAddress: address }),
}));
