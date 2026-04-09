import { create } from "zustand";

interface SosState {
  isSosActive: boolean;
  customMessage: string;
  setSosActive: (v: boolean) => void;
  setCustomMessage: (msg: string) => void;
}

export const useSosStore = create<SosState>((set) => ({
  isSosActive: false,
  customMessage: "SOS! I need help!",
  setSosActive: (isSosActive) => set({ isSosActive }),
  setCustomMessage: (customMessage) => set({ customMessage }),
}));
