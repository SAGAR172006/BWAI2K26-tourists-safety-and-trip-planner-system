"use client";
import { useState, useCallback } from "react";

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
}

/**
 * Hook for Gmail integration — fetches confirmation / booking emails.
 */
export function useGmail() {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingEmails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gmail");
      if (!res.ok) throw new Error("Failed to fetch emails");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, fetchBookingEmails };
}
