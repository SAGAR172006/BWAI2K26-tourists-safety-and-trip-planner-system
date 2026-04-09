"use client";
import SearchBar from "./SearchBar";
import DestinationSlideshow from "./DestinationSlideshow";
import WaitingSection from "./WaitingSection";

export default function IdleHomeScreen() {
  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/images/media__1775692126365.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(24px) saturate(120%) brightness(1.1)",
        }}
        aria-hidden="true"
      />
      
      {/* Hero section */}
      <section className="relative z-10 px-6 pt-8 pb-16 max-w-6xl mx-auto">
        <div className="mb-10">
          <SearchBar />
        </div>
        <DestinationSlideshow />
      </section>

      {/* Feature grid below fold */}
      <WaitingSection />
    </div>
  );
}
