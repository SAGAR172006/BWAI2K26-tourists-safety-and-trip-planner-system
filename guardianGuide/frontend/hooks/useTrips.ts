"use client";
import { useEffect, useCallback } from "react";
import { useTripStore } from "@/store/tripStore";
import type { Trip } from "@/store/tripStore";

/**
 * Hook for CRUD operations on trips.
 */
export function useTrips() {
  const trips = useTripStore((s) => s.trips);
  const setTrips = useTripStore((s) => s.setTrips);
  const addTrip = useTripStore((s) => s.addTrip);
  const setActiveTripId = useTripStore((s) => s.setActiveTripId);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  }, [setTrips]);

  const createTrip = useCallback(
    async (name: string, destination?: string) => {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, destination }),
      });
      if (!res.ok) {
        console.error("Failed to create trip", await res.text());
        throw new Error("Failed to create trip");
      }
      const j = (await res.json()) as { trip: Trip };
      addTrip(j.trip);
      setActiveTripId(j.trip.id);
      return j.trip;
    },
    [addTrip, setActiveTripId]
  );

  return { trips, fetchTrips, createTrip, setActiveTripId };
}
