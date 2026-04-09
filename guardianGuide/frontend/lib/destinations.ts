export interface Destination {
  id: string;
  name: string;
  country: string;
  emoji: string;
  summary: string;
  image: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    emoji: "🇫🇷",
    summary: "The City of Light — iconic architecture, world-class cuisine, and timeless romance.",
    image: "/images/media__1775695260558.jpg",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    emoji: "🇯🇵",
    summary: "Where ancient temples meet neon-lit streets — a sensory overload in the best way.",
    image: "/images/media__1775695260574.jpg",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    emoji: "🇮🇩",
    summary: "Island of the Gods — lush rice terraces, sacred temples, and world-class surf.",
    image: "/images/media__1775695260589.jpg",
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    emoji: "🇺🇸",
    summary: "The city that never sleeps — endless energy, culture, and skyline magic.",
    image: "/images/media__1775695260620.jpg",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    emoji: "\u{1F1F9}\u{1F1F7}",
    summary: "Where East meets West — bazaars, Bosphorus views, and layers of civilization.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    emoji: "\u{1F1EC}\u{1F1F7}",
    summary: "Dramatic caldera views, whitewashed villages, and Aegean sunsets.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    emoji: "\u{1F1EF}\u{1F1F5}",
    summary: "Japan\'s cultural soul — geisha districts, bamboo groves, and 1600 temples.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    emoji: "\u{1F1E6}\u{1F1EA}",
    summary: "Futuristic skyline rising from desert — luxury, ambition, and spectacle.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
  },
];
