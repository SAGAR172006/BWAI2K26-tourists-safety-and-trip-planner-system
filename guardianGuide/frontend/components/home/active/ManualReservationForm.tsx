"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

interface Props {
  tripId: string;
  onClose: () => void;
}

export default function ManualReservationForm({ tripId, onClose }: Props) {
  const [type, setType] = useState("flight");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    await supabase.from("reservations").insert({
      user_id: user.id,
      trip_id: tripId,
      type,
      source: "manual",
      details: { subject: details },
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-3 text-text-primary font-semibold">Add Reservation</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-body-sm text-text-secondary mb-1.5 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-accent"
            >
              {["flight","train","bus","hotel","dorm","other"].map((t) => (
                <option key={t} value={t} className="bg-bg-elevated capitalize">{t}</option>
              ))}
            </select>
          </div>
          <Input
            label="Details (paste confirmation text)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Flight PNR: ABC123..."
          />
          <Button fullWidth onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
