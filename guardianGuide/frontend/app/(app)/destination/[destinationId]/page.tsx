"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { DESTINATIONS } from "@/lib/destinations";

export default function DestinationPage() {
  const { destinationId } = useParams<{ destinationId: string }>();
  const router = useRouter();
  const dest = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  const images = [dest.image, dest.image, dest.image]; // use same image in 3 slots

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      {/* Image grid */}
      <div className="grid grid-cols-5 gap-3 rounded-2xl overflow-hidden mb-8" style={{ height: 360 }}>
        <div className="col-span-3 relative">
          <Image src={images[0]} alt={dest.name} fill className="object-cover" unoptimized />
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="relative flex-1">
            <Image src={images[1]} alt={dest.name} fill className="object-cover rounded-xl" unoptimized />
          </div>
          <div className="relative flex-1">
            <Image src={images[2]} alt={dest.name} fill className="object-cover rounded-xl" unoptimized />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 mb-4">
        <MapPin size={20} className="text-accent mt-1 flex-shrink-0" />
        <div>
          <h1
            className="text-heading-1 text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {dest.name}
          </h1>
          <p className="text-body-sm text-text-secondary">{dest.country}</p>
        </div>
      </div>

      <p className="text-body text-text-secondary leading-relaxed mb-12 max-w-2xl">
        {dest.summary} Explore iconic landmarks, immerse yourself in local culture,
        and create memories that will last a lifetime. GuardianGuide monitors safety
        zones in real-time so you can explore with confidence.
      </p>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-xl border border-border hover:border-border-strong"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          onClick={() => router.push(`/planner/new?destination=${encodeURIComponent(dest.name)}`)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-strong)" }}
        >
          Plan this trip
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
