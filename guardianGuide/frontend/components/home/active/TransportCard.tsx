"use client";
import { Plane, Train, Bus } from "lucide-react";

interface Reservation {
  id: string;
  type: "flight" | "train" | "bus" | "hotel" | "dorm" | "other";
  details: Record<string, any>;
  confirmation_number?: string;
}

const icons = { flight: Plane, train: Train, bus: Bus, hotel: () => null, dorm: () => null, other: () => null };

export default function TransportCard({ reservation }: { reservation: Reservation }) {
  const Icon = icons[reservation.type] || Bus;
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm text-text-primary font-medium capitalize">{reservation.type}</p>
        {reservation.confirmation_number && (
          <p className="text-caption text-text-muted font-mono">#{reservation.confirmation_number}</p>
        )}
        {reservation.details?.subject && (
          <p className="text-caption text-text-muted truncate">{reservation.details.subject}</p>
        )}
      </div>
      <span className="text-caption text-text-muted capitalize px-2 py-1 bg-bg-elevated rounded-lg">
        {reservation.type}
      </span>
    </div>
  );
}
