import { create } from "zustand";

interface UIState {
  sidePanelOpen: boolean;
  isLoading: boolean;
  setSidePanelOpen: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  toggleSidePanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidePanelOpen: false,
  isLoading: false,
  setSidePanelOpen: (sidePanelOpen) => set({ sidePanelOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidePanel: () => set((s) => ({ sidePanelOpen: !s.sidePanelOpen })),
}));
