/** Centralized route definitions */

export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",
  VERIFY_EMAIL: "/verify-email",
  COMPLETE_PROFILE: "/complete-profile",

  PLANNER: (tripId: string) => `/planner/${tripId}`,
  ITINERARY: (tripId: string) => `/itinerary/${tripId}`,
  EXPENSES: (tripId: string) => `/itinerary/${tripId}/expenses`,
  MUST_VISIT: (tripId: string) => `/must-visit/${tripId}`,
  MUST_AVOID: (tripId: string) => `/must-avoid/${tripId}`,
  DESTINATION: (destinationId: string) => `/destination/${destinationId}`,
  ACTIVE_TRIP: (tripId: string) => `/home/${tripId}`,

  SOS: "/sos",
  USER: "/user",
} as const;
