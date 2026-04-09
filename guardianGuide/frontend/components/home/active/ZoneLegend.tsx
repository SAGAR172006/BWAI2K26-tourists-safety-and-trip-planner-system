const zones = [
  { color: "var(--color-zone-green)", label: "Safe Zone", desc: "Score > 3.0" },
  { color: "var(--color-zone-white)", label: "Neutral Zone", desc: "Score 2.0 – 3.0" },
  { color: "var(--color-zone-red)", label: "Caution Zone", desc: "Score < 2.0" },
];

export default function ZoneLegend() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="text-body-sm font-semibold text-text-primary mb-3">Safety Zones</h3>
      <div className="flex flex-col gap-2">
        {zones.map(({ color, label, desc }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{ background: color, opacity: 0.8 }}
            />
            <div>
              <p className="text-body-sm text-text-primary">{label}</p>
              <p className="text-caption text-text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
