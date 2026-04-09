export type TripStatus = "idle" | "planning" | "active" | "completed";

export interface Trip {
  id: string;
  name: string;
  destination?: string;
  destinationId?: string;
  status: TripStatus;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}
