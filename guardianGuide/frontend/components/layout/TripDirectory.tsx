"use client";
import { ChevronRight, Plus, FolderOpen } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { useRouter } from "next/navigation";
import { useTrips } from "@/hooks/useTrips";

export default function TripDirectory() {
  const { trips, activeTripId, setActiveTripId } = useTripStore();
  const { createTrip } = useTrips();
  const router = useRouter();

  const onNewTrip = async () => {
    const n = trips.length + 1;
    const trip = await createTrip(`New Trip ${n}`);
    router.push(`/home/${trip.id}`);
  };

  return (
    <div className="flex items-center gap-2 text-body-sm text-text-muted overflow-x-auto max-w-md md:max-w-xl">
      <FolderOpen size={14} />
      <span className="text-text-secondary font-mono shrink-0">TRIPS/</span>
      {trips.map((trip, i) => (
        <div key={trip.id} className="flex items-center gap-1 min-w-0">
          {i > 0 && <ChevronRight size={12} className="shrink-0" />}
          <button
            type="button"
            onClick={() => {
              setActiveTripId(trip.id);
              router.push(`/home/${trip.id}`);
            }}
            className={`truncate hover:text-text-primary transition-colors ${trip.id === activeTripId ? "text-accent" : ""}`}
          >
            {trip.name}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => void onNewTrip()}
        className="ml-2 flex items-center gap-1 text-accent hover:text-accent-hover transition-colors shrink-0"
      >
        <Plus size={12} />
        <span>New Trip</span>
      </button>
    </div>
  );
}
