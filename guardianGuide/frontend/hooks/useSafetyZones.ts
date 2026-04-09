"use client";
import { useState, useCallback } from "react";
import type { ZoneColor } from "@/constants/zones";

export interface SafetyZone {
  id: string;
  name: string;
  zone_color: ZoneColor;
  latitude: number;
  longitude: number;
  radius_meters: number;
  description?: string;
}

/**
 * Fetches and manages safety zones for a destination.
 */
export function useSafetyZones(destinationId?: string) {
  const [zones, setZones] = useState<SafetyZone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    if (!destinationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/zones?destinationId=${destinationId}`);
      if (!res.ok) throw new Error("Failed to load safety zones");
      const data = await res.json();
      setZones(data.zones ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [destinationId]);

  const getZoneColor = useCallback(
    (lat: number, lng: number): ZoneColor => {
      // Simple point-in-radius check
      for (const zone of zones) {
        const dist = haversine(lat, lng, zone.latitude, zone.longitude);
        if (dist <= zone.radius_meters) return zone.zone_color;
      }
      return "white"; // Default moderate
    },
    [zones]
  );

  return { zones, isLoading, error, fetchZones, getZoneColor };
}

/** Haversine distance in meters */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
