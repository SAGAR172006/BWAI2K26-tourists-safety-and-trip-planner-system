"use client";
import dynamic from "next/dynamic";

const SafetyMiniMapInner = dynamic(() => import("./SafetyMiniMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl border border-border flex items-center justify-center"
      style={{ height: 340, background: "var(--color-bg-secondary)" }}
    >
      <span className="text-body-sm text-text-muted">Loading map...</span>
    </div>
  ),
});

export default SafetyMiniMapInner;
