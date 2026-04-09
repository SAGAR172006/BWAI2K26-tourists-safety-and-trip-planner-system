"use client";
import { motion } from "framer-motion";
import { Map, Bot, Shield, Bell } from "lucide-react";

const features = [
  { icon: Map, title: "Safety Zones", desc: "Real-time Green/White/Red zone mapping with live sentiment scores" },
  { icon: Bot, title: "AI Trip Planner", desc: "LangGraph-powered itinerary with budget guardrails and alternatives" },
  { icon: Shield, title: "SOS Emergency", desc: "One-tap alert to contacts with GPS coordinates in under 3 seconds" },
  { icon: Bell, title: "Gmail Sync", desc: "Auto-imports your booking confirmations directly into your itinerary" },
];

export default function WaitingSection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-display text-text-primary mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Waiting for you to{" "}
          <span style={{ color: "var(--color-accent)" }}>PLAN</span>
        </h2>
        <p className="text-body text-text-secondary max-w-xl mx-auto">
          GuardianGuide keeps you safe and guided throughout every journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            className="bg-bg-secondary border border-border rounded-xl p-6 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-accent-dim)" }}
            >
              <Icon size={20} style={{ color: "var(--color-accent)" }} />
            </div>
            <h3 className="text-heading-3 text-text-primary font-semibold">{title}</h3>
            <p className="text-body-sm text-text-secondary">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
