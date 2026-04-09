"use client";
import { ChevronRight, Plus, FolderOpen } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { useRouter } from "next/navigation";

export default function TripDirectory() {
  const { trips, activeTripId, setActiveTripId } = useTripStore();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-body-sm text-text-muted overflow-x-auto">
      <FolderOpen size={14} />
      <span className="text-text-secondary font-mono">TRIPS/</span>
      {trips.map((trip, i) => (
        <div key={trip.id} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          <button
            onClick={() => {
              setActiveTripId(trip.id);
              router.push(`/home/${trip.id}`);
            }}
            className={`hover:text-text-primary transition-colors ${trip.id === activeTripId ? "text-accent" : ""}`}
          >
            {trip.name}
          </button>
        </div>
      ))}
      <button
        onClick={() => router.push("/home")}
        className="ml-2 flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
      >
        <Plus size={12} />
        <span>New Trip</span>
      </button>
    </div>
  );
}
