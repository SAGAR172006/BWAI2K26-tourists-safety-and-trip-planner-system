"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DestinationCard from "./DestinationCard";
import DestinationText from "./DestinationText";
import { DESTINATIONS } from "@/lib/destinations";

export default function DestinationSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % DESTINATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const dest = DESTINATIONS[index];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <AnimatePresence mode="wait">
        <DestinationCard key={`card-${dest.id}`} dest={dest} />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <DestinationText key={`text-${dest.id}`} dest={dest} />
      </AnimatePresence>
    </div>
  );
}
