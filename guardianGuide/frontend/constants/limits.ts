/** App-wide limits and thresholds */

export const LIMITS = {
  /** Max characters in the planner expectations textarea */
  EXPECTATIONS_MAX_CHARS: 500,

  /** Max number of emergency contacts per user */
  MAX_EMERGENCY_CONTACTS: 3,

  /** Rate limit: max OTP requests per hour */
  OTP_RATE_LIMIT: 5,

  /** Rate limit window in milliseconds (1 hour) */
  RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000,

  /** Max trip duration in days */
  MAX_TRIP_DAYS: 30,

  /** Min trip duration in days */
  MIN_TRIP_DAYS: 1,

  /** Max budget strikes before locking budget input */
  MAX_BUDGET_STRIKES: 2,

  /** Debounce delay for search inputs (ms) */
  SEARCH_DEBOUNCE_MS: 300,

  /** Max file upload size for profile picture (5MB) */
  MAX_AVATAR_SIZE_BYTES: 5 * 1024 * 1024,
} as const;
