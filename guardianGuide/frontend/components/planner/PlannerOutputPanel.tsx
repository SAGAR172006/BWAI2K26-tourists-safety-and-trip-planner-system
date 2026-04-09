'use client';
import React from 'react';
import { usePlannerStore } from '@/store/plannerStore';

export default function PlannerOutputPanel() {
  const store = usePlannerStore();

  if (store.isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
        <div className="animate-pulse w-12 h-12 rounded-full bg-[var(--color-accent)] mb-4"></div>
        <p>Planning your perfect trip...</p>
      </div>
    );
  }

  if (!store.itinerary) {
     return (
       <div className="p-12 text-center text-[var(--color-text-muted)] h-full flex items-center justify-center">
         Fill details and generate to see your itinerary here.
       </div>
     );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-display font-bold mb-6">{store.itinerary.title}</h2>
      <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-4 mb-6">
         <p className="text-sm">{store.itinerary.summary}</p>
         <div className="mt-4 font-mono text-[var(--color-accent)] text-lg">
           Total Est. Cost: {store.itinerary.total_estimated_cost} {store.itinerary.currency}
         </div>
      </div>
      
      <div className="space-y-6">
        {store.itinerary.days.map((day: any) => (
          <div key={day.day}>
            <h3 className="text-xl font-bold bg-[var(--color-bg-primary)] p-3 rounded-lg">Day {day.day} - {day.date}</h3>
            <div className="pl-4 mt-4 space-y-4 border-l-2 border-[var(--color-border)]">
              {day.activities.map((act: any, idx: number) => (
                 <div key={idx} className="bg-[var(--color-bg-elevated)] p-4 rounded-lg">
                   <div className="font-bold flex justify-between">
                     <span>{act.time_of_day.toUpperCase()} | {act.name}</span>
                     <span className="text-[var(--color-accent)]">{act.estimated_cost} {store.itinerary?.currency}</span>
                   </div>
                   <p className="text-sm text-[var(--color-text-secondary)] mt-2">{act.description}</p>
                   <div className="text-xs text-[var(--color-text-muted)] mt-2 italic">{act.location}</div>
                   <div className="flex gap-2 mt-3">
                     {act.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-1 rounded-full">{tag}</span>
                     ))}
                   </div>
                 </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
