"use client";
import { useTripStore } from "@/store/tripStore";

/**
 * Returns the currently active trip from the trip store.
 */
export function useActiveTrip() {
  const trips = useTripStore((s) => s.trips);
  const activeTripId = useTripStore((s) => s.activeTripId);

  const activeTrip = activeTripId
    ? trips.find((t) => t.id === activeTripId) ?? null
    : null;

  return { activeTrip, activeTripId };
}
