'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function ExpensesPage() {
  const params = useParams();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold font-display">Expenses Tracker</h1>
         <button className="bg-[var(--color-bg-elevated)] px-4 py-2 text-white font-bold rounded-lg">+</button>
      </div>
      
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)]">
        <div className="p-4 flex justify-between items-center hover:bg-[var(--color-bg-elevated)] transition">
          <div>
            <div className="font-bold">Local Lunch</div>
            <div className="text-xs text-[var(--color-text-muted)]">Today, Food</div>
          </div>
          <div className="font-mono font-bold">$25.00</div>
        </div>
        <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">
          End of expenses. Add more to keep track!
        </div>
      </div>
    </div>
  );
}
