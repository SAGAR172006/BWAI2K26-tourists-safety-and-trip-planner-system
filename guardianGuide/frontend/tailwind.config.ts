import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-elevated": "var(--color-bg-elevated)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "border": "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        "accent": "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "error": "var(--color-error)",
        "success": "var(--color-success)",
        "zone-green": "var(--color-zone-green)",
        "zone-green-bg": "var(--color-zone-green-bg)",
        "zone-white": "var(--color-zone-white)",
        "zone-white-bg": "var(--color-zone-white-bg)",
        "zone-red": "var(--color-zone-red)",
        "zone-red-bg": "var(--color-zone-red-bg)",
      },
      fontSize: {
        "heading-1": "2.5rem",
        "heading-2": "2rem",
        "heading-3": "1.5rem",
        "body-lg": "1.125rem",
        "body-md": "1rem",
        "body-sm": "0.875rem",
        "caption": "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
