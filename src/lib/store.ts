import { create } from "zustand";

export type ViewType =
  | "home"
  | "plans"
  | "plan-detail"
  | "cabins"
  | "cabin-detail"
  | "contact"
  | "policies"
  | "favorites"
  | "team";

interface NavigationState {
  currentView: ViewType;
  selectedItemId: string | null;
  navigate: (view: ViewType, itemId?: string | null) => void;
  goHome: () => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentView: "home",
  selectedItemId: null,
  navigate: (view, itemId = null) => {
    set({ currentView: view, selectedItemId: itemId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  goHome: () => {
    set({ currentView: "home", selectedItemId: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}));
