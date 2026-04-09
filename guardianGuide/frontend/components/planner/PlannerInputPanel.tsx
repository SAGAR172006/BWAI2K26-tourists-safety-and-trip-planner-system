'use client';
import React, { useState } from 'react';
import { usePlannerStore } from '@/store/plannerStore';
import { usePlanner } from '@/hooks/usePlanner';

export default function PlannerInputPanel({ tripId }: { tripId: string }) {
  const store = usePlannerStore();
  const { generateItinerary } = usePlanner();

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-display">Plan Your Trip</h1>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">From</label>
        <input 
          value={store.inputs.fromLocation}
          onChange={(e) => store.setInput('fromLocation', e.target.value)}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 text-white" 
          placeholder="Where are you leaving from?" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">To</label>
        <input 
          value={store.inputs.toLocation}
          onChange={(e) => store.setInput('toLocation', e.target.value)}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 text-white" 
          placeholder="Destination" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Budget</label>
        <div className="flex gap-2">
            <select 
              value={store.inputs.currency}
              onChange={(e) => store.setInput('currency', e.target.value)}
              className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 text-white"
            >
                <option value="USD">🇺🇸 USD</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="JPY">🇯🇵 JPY</option>
            </select>
            <input 
              type="number"
              value={store.inputs.budget}
              onChange={(e) => store.setInput('budget', parseFloat(e.target.value))}
              disabled={store.strikeCount === 2}
              className={`flex-1 bg-[var(--color-bg-elevated)] border rounded-xl p-3 text-white ${store.strikeCount === 2 ? 'opacity-50 cursor-not-allowed border-[var(--color-error)]' : 'border-[var(--color-border)]'}`} 
            />
        </div>
        {store.strikeCount === 1 && <div className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] p-3 rounded-lg text-sm">⚠️ Suggested minimum: {store.inputs.currency}{store.minBudget}</div>}
        {store.strikeCount === 2 && <div className="bg-[var(--color-error)]/10 text-[var(--color-error)] p-3 rounded-lg text-sm">❌ Budget too low. Minimum required: {store.inputs.currency}{store.minBudget}</div>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Expectations (optional)</label>
        <textarea 
          value={store.inputs.expectations}
          onChange={(e) => store.setInput('expectations', e.target.value)}
          maxLength={500}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 text-white min-h-[100px]" 
        />
      </div>

      <button
        onClick={() => generateItinerary(tripId)}
        disabled={store.isLoading || store.strikeCount === 2}
        className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {store.isLoading ? 'Generating...' : 'Generate Itinerary →'}
      </button>
    </div>
  );
}
