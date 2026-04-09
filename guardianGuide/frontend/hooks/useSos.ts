"use client";
import { useState, useCallback } from "react";
import { useSosStore } from "@/store/sosStore";

/**
 * Handles SOS emergency alert dispatch.
 */
export function useSos() {
  const [isSending, setIsSending] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);
  const customMessage = useSosStore((s) => s.customMessage);
  const setSosActive = useSosStore((s) => s.setSosActive);

  const sendAlert = useCallback(
    async (location?: { latitude: number; longitude: number }) => {
      setIsSending(true);
      setSosActive(true);

      try {
        const res = await fetch("/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: customMessage,
            location,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!res.ok) throw new Error("Failed to send SOS");
        setLastSentAt(new Date());
        return true;
      } catch (err) {
        console.error("SOS send failed:", err);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [customMessage, setSosActive]
  );

  return { sendAlert, isSending, lastSentAt };
}
