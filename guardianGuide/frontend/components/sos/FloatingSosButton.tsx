"use client";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingSosButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/sos")}
      className="sos-pulse fixed bottom-8 right-8 z-90 w-16 h-16 rounded-full flex items-center justify-center"
      style={{
        background: "var(--color-sos-primary)",
        color: "white",
        boxShadow: "0 4px 24px rgba(255,26,26,0.5)",
      }}
      aria-label="Emergency SOS"
    >
      <AlertTriangle size={28} />
    </button>
  );
}
