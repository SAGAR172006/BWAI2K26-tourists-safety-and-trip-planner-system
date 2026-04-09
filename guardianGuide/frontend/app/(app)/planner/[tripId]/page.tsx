'use client';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';
import dynamic from 'next/dynamic';

const PlannerInputPanel = dynamic(() => import('@/components/planner/PlannerInputPanel'), { ssr: false });
const PlannerOutputPanel = dynamic(() => import('@/components/planner/PlannerOutputPanel'), { ssr: false });

export default function PlannerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const setInput = usePlannerStore(state => state.setInput);

  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest) setInput('toLocation', dest);
    
    // Stub Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // In a real app we'd reverse geocode here.
        setInput('fromLocation', 'Current Location');
      }, () => {
        setInput('fromLocation', 'Unknown');
      });
    }
  }, [searchParams, setInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="overflow-y-auto border-r border-[var(--color-border)]">
        <PlannerInputPanel tripId={params.tripId as string} />
      </div>
      <div className="overflow-y-auto bg-[var(--color-bg-secondary)]">
        <PlannerOutputPanel />
      </div>
    </div>
  );
}
