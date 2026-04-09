export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: number;
  category?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  accommodation?: string;
  estimatedCost: number;
}

export interface Itinerary {
  title: string;
  days: ItineraryDay[];
  totalEstimatedCost: number;
  currency: string;
  summary?: string;
  tags?: string[];
}

export interface PlannerSession {
  sessionId: string;
  itinerary: Itinerary | null;
  alternatives: Itinerary[];
  strikeCount: number;
  minBudget?: number;
  status: "idle" | "generating" | "strike1" | "strike2" | "done";
}
