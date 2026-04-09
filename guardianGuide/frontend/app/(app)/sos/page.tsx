"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SosPage() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {
        setLat(0);
        setLng(0);
      }
    );
  }, []);

  const handleSOS = async () => {
    setPulse(true);
    setStatus(null);
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates: { lat: lat ?? 0, lng: lng ?? 0 },
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus(`Alert queued (recipients: ${data.sent_to ?? 0}).`);
      } else {
        setStatus(data.detail || "Could not send alert. Check backend configuration.");
      }
    } catch {
      setStatus("Network error sending alert.");
    }
    setTimeout(() => setPulse(false), 2000);
  };

  return (
    <div className="sos-theme min-h-screen text-[#FFE0E0] p-8 flex flex-col pt-16">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-6 left-6 opacity-70 hover:opacity-100"
      >
        ← Back to Safety
      </button>

      <div className="text-center mb-12 mt-8">
        <h1 className="text-5xl font-black font-display text-[#FF1A1A] tracking-widest shadow-sm">
          EMERGENCY
        </h1>
        <p className="mt-2 opacity-80">
          Trigger an alert to your saved emergency contacts (SMS/email when configured on the server).
        </p>
        {lat != null && lng != null && (
          <p className="text-xs text-[#FFE0E0]/60 mt-2 font-mono">
            Location: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mb-12">
        {["Police / emergency", "Medical", "Fire"].map((serv) => (
          <div
            key={serv}
            className="bg-[#FF1A1A]/10 border border-[#FF1A1A]/30 p-6 rounded-2xl text-center"
          >
            <h3 className="font-bold text-xl mb-2">{serv}</h3>
            <div className="text-3xl font-mono text-[#FF1A1A]">112</div>
            <p className="text-xs opacity-70 mt-2">EU emergency; use local numbers when abroad.</p>
          </div>
        ))}
      </div>

      {status && (
        <p className="text-center text-sm mb-4 max-w-lg mx-auto opacity-90">{status}</p>
      )}

      <div className="max-w-2xl mx-auto w-full">
        <button
          type="button"
          onClick={() => void handleSOS()}
          className={`w-full bg-[#FF1A1A] text-white py-8 rounded-full text-2xl font-black transition-all ${
            pulse
              ? "animate-pulse scale-95 opacity-50"
              : "hover:scale-105 shadow-[0_0_40px_rgba(255,26,26,0.5)]"
          }`}
        >
          SEND ALERT TO MY CONTACTS
        </button>
      </div>
    </div>
  );
}
