'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MustAvoidPage() {
  const router = useRouter();
  return (
    <div className="p-6">
       <button onClick={() => router.back()} className="text-[var(--color-accent)] mb-6">← Back</button>
       <h1 className="text-3xl font-display font-bold text-[var(--color-zone-red)] mb-6">Must Avoid: High Risk</h1>
       <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-8 text-center text-[var(--color-text-muted)]">
          Loaded spots in RED zones or with poor reviews.
       </div>
    </div>
  );
}
