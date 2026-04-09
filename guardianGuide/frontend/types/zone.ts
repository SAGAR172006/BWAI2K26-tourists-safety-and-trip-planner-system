export type ZoneColor = "green" | "white" | "red";

export interface SafetyZone {
  id: string;
  locationHash: string;
  destination: string;
  geojson: Record<string, unknown>;
  score?: number;
  zone?: ZoneColor;
  venueScore?: number;
  socialScore?: number;
  sampleSize: number;
  lastUpdated: string;
}
