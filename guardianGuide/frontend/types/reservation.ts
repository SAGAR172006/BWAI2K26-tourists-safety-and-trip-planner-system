export type ReservationType = "flight" | "train" | "bus" | "hotel" | "dorm" | "other";
export type ReservationSource = "manual" | "gmail" | "ai";

export interface Reservation {
  id: string;
  tripId: string;
  type: ReservationType;
  source: ReservationSource;
  details: Record<string, unknown>;
  confirmationNumber?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
}
