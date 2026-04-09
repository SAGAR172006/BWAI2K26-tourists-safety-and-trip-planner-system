"use client";
import { Hotel } from "lucide-react";

interface Props {
  name: string;
  checkIn?: string;
  checkOut?: string;
  confirmation?: string;
}

export default function StayCard({ name, checkIn, checkOut, confirmation }: Props) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Hotel size={18} className="text-accent" />
      </div>
      <div>
        <p className="text-body-sm text-text-primary font-medium">{name}</p>
        {checkIn && checkOut && (
          <p className="text-caption text-text-muted">{checkIn} → {checkOut}</p>
        )}
        {confirmation && (
          <p className="text-caption text-text-muted font-mono">#{confirmation}</p>
        )}
      </div>
    </div>
  );
}
