export type SpotCategory =
  | "food"
  | "stay"
  | "entertainment"
  | "cultural"
  | "art"
  | "shopping"
  | "nature"
  | "other";

export interface TouristSpot {
  id: string;
  destination: string;
  name: string;
  category?: SpotCategory;
  address?: string;
  lat?: number;
  lng?: number;
  foursquareId?: string;
  rating?: number;
  zone?: string;
  mapsUrl?: string;
}
