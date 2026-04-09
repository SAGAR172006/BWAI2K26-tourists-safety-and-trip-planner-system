"use client";
import { useEffect, useState } from "react";
import SafetyMiniMap from "./SafetyMiniMap";
import ZoneLegend from "./ZoneLegend";
import MustVisitCard from "./MustVisitCard";
import MustAvoidCard from "./MustAvoidCard";
import AlreadyVisitedCard from "./AlreadyVisitedCard";
import ReservationsPanel from "./ReservationsPanel";
import ManualReservationBtn from "./ManualReservationBtn";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

interface Props {
  tripId: string;
}

export default function ActiveHomeScreen({ tripId }: Props) {
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);
  const [geojson, setGeojson] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }
    fetchReservations();
  }, [tripId]);

  const fetchReservations = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .eq("trip_id", tripId);
    if (data) setReservations(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-text-primary font-semibold">Your Trip</h2>
            <ManualReservationBtn tripId={tripId} />
          </div>
          <ReservationsPanel reservations={reservations} />
          <MustVisitCard tripId={tripId} spots={[]} />
          <MustAvoidCard tripId={tripId} places={[]} />
          <AlreadyVisitedCard places={visitedPlaces} />
        </div>

        {/* Right: Map (sticky) */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 flex flex-col gap-4">
            <SafetyMiniMap lat={lat} lng={lng} geojson={geojson} />
            <ZoneLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
