export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  emoji: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "US", dialCode: "+1",   name: "United States", emoji: "🇺🇸" },
  { code: "GB", dialCode: "+44",  name: "United Kingdom", emoji: "🇬🇧" },
  { code: "IN", dialCode: "+91",  name: "India",          emoji: "🇮🇳" },
  { code: "JP", dialCode: "+81",  name: "Japan",          emoji: "🇯🇵" },
  { code: "DE", dialCode: "+49",  name: "Germany",        emoji: "🇩🇪" },
  { code: "FR", dialCode: "+33",  name: "France",         emoji: "🇫🇷" },
  { code: "AU", dialCode: "+61",  name: "Australia",      emoji: "🇦🇺" },
  { code: "BR", dialCode: "+55",  name: "Brazil",         emoji: "🇧🇷" },
  { code: "CA", dialCode: "+1",   name: "Canada",         emoji: "🇨🇦" },
  { code: "IT", dialCode: "+39",  name: "Italy",          emoji: "🇮🇹" },
  { code: "ES", dialCode: "+34",  name: "Spain",          emoji: "🇪🇸" },
  { code: "MX", dialCode: "+52",  name: "Mexico",         emoji: "🇲🇽" },
  { code: "KR", dialCode: "+82",  name: "South Korea",    emoji: "🇰🇷" },
  { code: "TR", dialCode: "+90",  name: "Turkey",         emoji: "🇹🇷" },
  { code: "SG", dialCode: "+65",  name: "Singapore",      emoji: "🇸🇬" },
  { code: "TH", dialCode: "+66",  name: "Thailand",       emoji: "🇹🇭" },
  { code: "AE", dialCode: "+971", name: "UAE",             emoji: "🇦🇪" },
  { code: "ID", dialCode: "+62",  name: "Indonesia",      emoji: "🇮🇩" },
  { code: "GR", dialCode: "+30",  name: "Greece",         emoji: "🇬🇷" },
  { code: "NZ", dialCode: "+64",  name: "New Zealand",    emoji: "🇳🇿" },
];
