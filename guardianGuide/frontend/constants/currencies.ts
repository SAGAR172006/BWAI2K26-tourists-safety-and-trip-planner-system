export interface Currency {
  code: string;
  symbol: string;
  name: string;
  emoji: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",  name: "US Dollar",       emoji: "🇺🇸" },
  { code: "EUR", symbol: "€",  name: "Euro",            emoji: "🇪🇺" },
  { code: "GBP", symbol: "£",  name: "British Pound",   emoji: "🇬🇧" },
  { code: "JPY", symbol: "¥",  name: "Japanese Yen",    emoji: "🇯🇵" },
  { code: "INR", symbol: "₹",  name: "Indian Rupee",    emoji: "🇮🇳" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar",emoji: "🇦🇺" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar",  emoji: "🇨🇦" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", emoji: "🇸🇬" },
  { code: "AED", symbol: "د.إ",name: "UAE Dirham",       emoji: "🇦🇪" },
  { code: "THB", symbol: "฿",  name: "Thai Baht",       emoji: "🇹🇭" },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}
