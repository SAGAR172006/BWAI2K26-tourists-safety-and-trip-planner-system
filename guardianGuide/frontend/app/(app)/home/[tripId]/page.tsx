"use client";
import { useParams } from "next/navigation";
import ActiveHomeScreen from "@/components/home/active/ActiveHomeScreen";

export default function ActiveHomePage() {
  const { tripId } = useParams<{ tripId: string }>();
  return <ActiveHomeScreen tripId={tripId} />;
}
