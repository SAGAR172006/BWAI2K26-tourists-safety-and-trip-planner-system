import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, token: null }),
}));
