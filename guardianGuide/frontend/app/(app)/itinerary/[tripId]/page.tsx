'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ItineraryPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/trips/${params.tripId}`).then(res => res.json()).then(setTrip);
  }, [params.tripId]);

  if (!trip) return <div className="p-8">Loading trip data...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-6">
      <div className="flex flex-col gap-6">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
           <h3 className="text-xs text-[var(--color-text-muted)] tracking-widest mb-2 uppercase">Total Budget</h3>
           <div className="text-4xl font-mono font-bold text-[var(--color-accent)]">
             {trip.itineraries?.[0]?.total_budget || 0} {trip.itineraries?.[0]?.currency || 'USD'}
           </div>
        </div>
        
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold">Spendings</h3>
             <Link href={`/itinerary/${params.tripId}/expenses`} className="text-[var(--color-accent)] text-sm">View All →</Link>
           </div>
           <div className="w-full bg-[var(--color-bg-elevated)] rounded-full h-2 mb-2">
              <div className="bg-[var(--color-success)] h-2 rounded-full" style={{width: '25%'}}></div>
           </div>
           <p className="text-sm text-[var(--color-text-muted)]">$250 spent / $1000 total</p>
        </div>
      </div>
      
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 h-full">
         <h2 className="text-xl font-bold mb-4 font-display">Itinerary To-Do</h2>
         {trip.itineraries && trip.itineraries.length > 0 ? (
            <div className="text-[var(--color-text-muted)] italic">Itinerary content successfully loaded. View full timeline in planner or export it.</div>
         ) : (
            <p className="text-[var(--color-text-secondary)]">No itinerary generated yet. Go to Plan Trip to generate one.</p>
         )}
      </div>
    </div>
  );
}
