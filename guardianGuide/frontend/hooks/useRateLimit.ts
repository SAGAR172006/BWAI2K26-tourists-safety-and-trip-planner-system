"use client";
import { useRef, useCallback } from "react";
import { LIMITS } from "@/constants/limits";

/**
 * Simple client-side rate limiter.
 * Tracks calls within a sliding window and blocks after the limit.
 */
export function useRateLimit(maxCalls = LIMITS.OTP_RATE_LIMIT, windowMs = LIMITS.RATE_LIMIT_WINDOW_MS) {
  const callTimestamps = useRef<number[]>([]);

  const isRateLimited = useCallback(() => {
    const now = Date.now();
    // Purge expired timestamps
    callTimestamps.current = callTimestamps.current.filter(
      (ts) => now - ts < windowMs
    );
    return callTimestamps.current.length >= maxCalls;
  }, [maxCalls, windowMs]);

  const recordCall = useCallback(() => {
    callTimestamps.current.push(Date.now());
  }, []);

  const remainingCalls = useCallback(() => {
    const now = Date.now();
    const valid = callTimestamps.current.filter((ts) => now - ts < windowMs);
    return Math.max(0, maxCalls - valid.length);
  }, [maxCalls, windowMs]);

  return { isRateLimited, recordCall, remainingCalls };
}
