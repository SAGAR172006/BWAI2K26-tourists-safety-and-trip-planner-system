'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SosPage() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);

  const handleSOS = () => {
    setPulse(true);
    fetch('/api/sos', { method: 'POST', body: JSON.stringify({timestamp: new Date().toISOString()}) });
    setTimeout(() => alert('Alert Sent securely to Emergency Contacts.'), 1000);
  };

  return (
    <div className="sos-theme min-h-screen text-[#FFE0E0] p-8 flex flex-col pt-16">
      <button onClick={() => router.back()} className="absolute top-6 left-6 opacity-70 hover:opacity-100">← Back to Safety</button>
      
      <div className="text-center mb-12 mt-8">
        <h1 className="text-5xl font-black font-display text-[#FF1A1A] tracking-widest shadow-sm">EMERGENCY</h1>
        <p className="mt-2 opacity-80">Trigger an immediate alert to local authorities and your contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mb-12">
         {['Police', 'Ambulance', 'Fire'].map((serv) => (
            <div key={serv} className="bg-[#FF1A1A]/10 border border-[#FF1A1A]/30 p-6 rounded-2xl text-center">
              <h3 className="font-bold text-xl mb-2">{serv}</h3>
              <div className="text-3xl font-mono text-[#FF1A1A]">112</div>
            </div>
         ))}
      </div>

      <div className="max-w-2xl mx-auto w-full">
         <button 
           onClick={handleSOS}
           className={`w-full bg-[#FF1A1A] text-white py-8 rounded-full text-2xl font-black transition-all ${pulse ? 'animate-pulse scale-95 opacity-50' : 'hover:scale-105 shadow-[0_0_40px_rgba(255,26,26,0.5)]'}`}
         >
           SEND ALERT TO MY CONTACTS
         </button>
      </div>
    </div>
  );
}
