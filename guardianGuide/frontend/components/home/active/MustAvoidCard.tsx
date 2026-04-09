"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  tripId: string;
  places: string[];
}

export default function MustAvoidCard({ tripId, places }: Props) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-heading-3 text-text-primary font-semibold">Must Avoid</h3>
        <Link
          href={`/must-avoid/${tripId}`}
          className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowRight size={16} className="text-text-secondary" />
        </Link>
      </div>
      {places.length === 0 ? (
        <p className="text-body-sm text-text-muted py-4 text-center">No caution zones in your area.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {places.slice(0, 5).map((place, i) => (
            <li key={i} className="flex items-center gap-2 text-body-sm text-text-secondary border-b border-border pb-2 last:border-0">
              <span className="w-2 h-2 rounded-full bg-zone-red flex-shrink-0" />
              {place}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
