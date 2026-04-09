'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MustVisitPage() {
  const router = useRouter();
  return (
    <div className="p-6">
       <button onClick={() => router.back()} className="text-[var(--color-accent)] mb-6">← Back</button>
       <h1 className="text-3xl font-display font-bold text-[var(--color-zone-green)] mb-6">Must Visit: Safe Zones</h1>
       <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-8 text-center text-[var(--color-text-muted)]">
          Loaded highly rated spots in green zones.
       </div>
    </div>
  );
}
