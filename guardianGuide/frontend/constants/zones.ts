/** Safety zone classification */

export type ZoneColor = "green" | "white" | "red";

export interface ZoneConfig {
  color: ZoneColor;
  label: string;
  description: string;
  cssVar: string;
  bgCssVar: string;
  emoji: string;
}

export const ZONE_CONFIGS: Record<ZoneColor, ZoneConfig> = {
  green: {
    color: "green",
    label: "Safe Zone",
    description: "Well-reviewed, tourist-friendly area with low crime reports.",
    cssVar: "var(--color-zone-green)",
    bgCssVar: "var(--color-zone-green-bg)",
    emoji: "🟢",
  },
  white: {
    color: "white",
    label: "Moderate Zone",
    description: "Average safety — exercise normal precautions.",
    cssVar: "var(--color-zone-white)",
    bgCssVar: "var(--color-zone-white-bg)",
    emoji: "⚪",
  },
  red: {
    color: "red",
    label: "High Risk Zone",
    description: "Known for incidents or poor reviews — avoid if possible.",
    cssVar: "var(--color-zone-red)",
    bgCssVar: "var(--color-zone-red-bg)",
    emoji: "🔴",
  },
};
