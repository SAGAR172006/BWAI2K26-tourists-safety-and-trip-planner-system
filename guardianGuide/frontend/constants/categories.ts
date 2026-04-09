export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food & Drinks", emoji: "🍽️", color: "#FF6B6B" },
  { id: "transport", label: "Transport", emoji: "🚕", color: "#4ECDC4" },
  { id: "accommodation", label: "Stay", emoji: "🏨", color: "#45B7D1" },
  { id: "activities", label: "Activities", emoji: "🎭", color: "#96CEB4" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", color: "#FFEAA7" },
  { id: "health", label: "Health", emoji: "💊", color: "#DDA0DD" },
  { id: "misc", label: "Miscellaneous", emoji: "📦", color: "#A0A0A0" },
] as const;

export type CategoryId = (typeof EXPENSE_CATEGORIES)[number]["id"];
