"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Destination } from "@/lib/destinations";

export default function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-border"
      style={{ aspectRatio: "4/3", background: "var(--color-bg-secondary)" }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Image
        src={dest.image}
        alt={dest.name}
        fill
        className="object-cover"
        unoptimized
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
      >
        <p className="text-caption text-white/60">{dest.country}</p>
      </div>
    </motion.div>
  );
}
