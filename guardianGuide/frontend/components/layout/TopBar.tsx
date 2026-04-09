"use client";
import { AlignJustify, CircleUser } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import ShieldLogo from "@/components/ui/ShieldLogo";
import TripDirectory from "@/components/layout/TripDirectory";

export default function TopBar() {
  const { toggleSidePanel } = useUIStore();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 64,
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <Link href="/home" className="flex items-center gap-2 no-underline">
        <ShieldLogo size={28} />
        <span
          className="font-semibold text-text-primary"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
        >
          GuardianGuide
        </span>
      </Link>

      <div className="hidden md:flex flex-1 mx-6 justify-center min-w-0">
        <TripDirectory />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/user"
          className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
        >
          <CircleUser size={20} className="text-text-secondary" />
        </Link>
        <button
          onClick={toggleSidePanel}
          className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
          aria-label="Open menu"
        >
          <AlignJustify size={20} className="text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
