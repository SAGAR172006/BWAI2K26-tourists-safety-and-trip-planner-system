"use client";
import { motion } from "framer-motion";
import type { Destination } from "@/lib/destinations";

export default function DestinationText({ dest }: { dest: Destination }) {
  return (
    <motion.div
      className="flex flex-col justify-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <p className="text-body-sm text-text-muted mb-2">{dest.country}</p>
      <h2
        className="text-heading-1 text-text-primary mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {dest.name}
      </h2>
      <p className="text-body text-text-secondary leading-relaxed">{dest.summary}</p>
    </motion.div>
  );
}
