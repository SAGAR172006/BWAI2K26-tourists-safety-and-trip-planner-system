"use client";
import TransportCard from "./TransportCard";
import StayCard from "./StayCard";

interface Props {
  reservations: any[];
}

export default function ReservationsPanel({ reservations }: Props) {
  const transport = reservations.filter((r) => ["flight", "train", "bus"].includes(r.type));
  const stays = reservations.filter((r) => ["hotel", "dorm"].includes(r.type));

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="text-heading-3 text-text-primary font-semibold mb-3">Reservations</h3>
      {reservations.length === 0 ? (
        <p className="text-body-sm text-text-muted py-4 text-center">
          No reservations yet. Add manually or sync Gmail.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {transport.map((r) => <TransportCard key={r.id} reservation={r} />)}
          {stays.map((r) => (
            <StayCard
              key={r.id}
              name={r.details?.subject || "Accommodation"}
              confirmation={r.confirmation_number}
            />
          ))}
        </div>
      )}
    </div>
  );
}
