'use client';
import React from 'react';

export default function UserPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto h-full">
      <h1 className="font-display font-bold text-3xl mb-8">User Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] flex items-center justify-center text-4xl text-[var(--color-text-muted)] shadow-xl mb-4 group cursor-pointer relative overflow-hidden">
             👤
             <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-sm">Upload Avatar</div>
          </div>
          <div className="font-bold text-lg">Test User</div>
          <div className="text-[var(--color-text-muted)] text-sm mb-4">test@guardianguide.app</div>
          
          <button className="text-sm bg-[var(--color-accent)] px-4 py-2 rounded-lg text-white font-bold w-full">Sign Out</button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)]">
             <h2 className="font-bold text-lg mb-4">Profile Information</h2>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-[var(--color-text-muted)] mb-1 block">First Name</label>
                    <input className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md p-2 text-white" defaultValue="Test" />
                 </div>
                 <div>
                    <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Last Name</label>
                    <input className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md p-2 text-white" defaultValue="User" />
                 </div>
             </div>
          </div>

          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)]">
             <h2 className="font-bold text-lg mb-4 text-[var(--color-sos-primary)]">Emergency Contacts</h2>
             <div className="flex flex-col gap-3">
                 <div className="flex gap-2 items-center">
                    <input className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md p-2 text-white" placeholder="Name" defaultValue="Mom" />
                    <input className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md p-2 text-white" placeholder="Phone" defaultValue="+1234567890" />
                 </div>
                 <button className="border border-dashed border-[var(--color-border)] py-2 rounded-md text-[var(--color-text-muted)] hover:text-white transition">+ Add Contact</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
