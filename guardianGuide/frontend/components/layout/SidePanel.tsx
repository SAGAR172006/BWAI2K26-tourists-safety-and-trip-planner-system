"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Map, User, AlertTriangle, Plane } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import { useTripStore } from "@/store/tripStore";

const navLinks = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/user", icon: User, label: "Profile" },
  { href: "/sos", icon: AlertTriangle, label: "SOS Emergency" },
];

export default function SidePanel() {
  const { sidePanelOpen, setSidePanelOpen } = useUIStore();
  const { trips, activeTripId } = useTripStore();
  const activeTrip = trips.find((t) => t.id === activeTripId);

  return (
    <AnimatePresence>
      {sidePanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-90 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidePanelOpen(false)}
          />
          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-100 glass-panel"
            style={{ width: 320, borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="text-heading-3 text-text-primary font-semibold">Menu</span>
              <button
                onClick={() => setSidePanelOpen(false)}
                className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors"
              >
                <X size={16} className="text-text-secondary" />
              </button>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidePanelOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all no-underline"
                >
                  <Icon size={18} />
                  <span className="text-body-sm font-medium">{label}</span>
                </Link>
              ))}

              {activeTrip && (
                <>
                  <div className="h-px bg-border my-3" />
                  <p className="text-caption text-text-muted px-4 mb-2 uppercase tracking-wider">Active Trip</p>
                  <Link
                    href={`/home/${activeTrip.id}`}
                    onClick={() => setSidePanelOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-elevated text-accent transition-all no-underline"
                  >
                    <Plane size={18} />
                    <span className="text-body-sm font-medium">{activeTrip.destination || activeTrip.name}</span>
                  </Link>
                  <Link
                    href={`/planner/${activeTrip.id}`}
                    onClick={() => setSidePanelOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all no-underline"
                  >
                    <Map size={18} />
                    <span className="text-body-sm font-medium">Trip planner</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
