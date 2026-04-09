import { create } from "zustand";

export interface Trip {
  id: string;
  name: string;
  destination?: string;
  destinationId?: string;
  status: "idle" | "planning" | "active" | "completed";
  startDate?: string;
  endDate?: string;
}

interface TripState {
  trips: Trip[];
  activeTripId: string | null;
  setTrips: (trips: Trip[]) => void;
  setActiveTripId: (id: string | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  activeTripId: null,
  setTrips: (trips) => set({ trips }),
  setActiveTripId: (activeTripId) => set({ activeTripId }),
  addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),
  updateTrip: (id, updates) =>
    set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
}));
