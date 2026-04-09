import type { LatLngExpression } from "leaflet";

/**
 * Default map center (London) when user location is unavailable.
 */
export const DEFAULT_CENTER: LatLngExpression = [51.505, -0.09];
export const DEFAULT_ZOOM = 13;

/**
 * Zone color mapping for Leaflet circle overlays.
 */
export const ZONE_LEAFLET_COLORS = {
  green: { color: "#2ED573", fillColor: "#2ED573", fillOpacity: 0.15 },
  white: { color: "#747D8C", fillColor: "#747D8C", fillOpacity: 0.1 },
  red:   { color: "#FF4757", fillColor: "#FF4757", fillOpacity: 0.2 },
} as const;

/**
 * Custom marker icon configuration.
 */
export const USER_MARKER_ICON = {
  iconUrl: "/images/media__1775695260558.jpg",
  iconSize: [32, 32] as [number, number],
  iconAnchor: [16, 32] as [number, number],
};
