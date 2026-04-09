"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import ManualReservationForm from "./ManualReservationForm";

export default function ManualReservationBtn({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-body-sm text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
      >
        <Plus size={14} />
        Manual
      </button>
      {open && <ManualReservationForm tripId={tripId} onClose={() => setOpen(false)} />}
    </>
  );
}
