"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PlaceListItem from "./PlaceListItem";

interface Spot {
  id: string;
  name: string;
  category: string;
  maps_url?: string;
}

interface Props {
  tripId: string;
  spots: Spot[];
  onTick?: (id: string) => void;
}

export default function MustVisitCard({ tripId, spots, onTick }: Props) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-heading-3 text-text-primary font-semibold">Must Visit</h3>
        <Link
          href={`/must-visit/${tripId}`}
          className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowRight size={16} className="text-text-secondary" />
        </Link>
      </div>
      {spots.length === 0 ? (
        <p className="text-body-sm text-text-muted py-4 text-center">
          Generate an itinerary to see must-visit spots.
        </p>
      ) : (
        spots.slice(0, 5).map((spot) => (
          <PlaceListItem
            key={spot.id}
            name={spot.name}
            category={spot.category}
            onTick={() => onTick?.(spot.id)}
            onNavigate={() => spot.maps_url && window.open(spot.maps_url, "_blank")}
          />
        ))
      )}
    </div>
  );
}
