"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ShieldLogo from "@/components/ui/ShieldLogo";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error: err } = await supabase
        .from("users")
        .upsert({ id: user.id, first_name: firstName, last_name: lastName, email: user.email });
      if (err) throw err;
      router.push("/home");
    } catch (e: any) {
      setError(e.message || "Failed to save profile.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <ShieldLogo size={40} />
        <h1 className="text-heading-2 text-text-primary mt-3 font-semibold">Complete your profile</h1>
      </div>
      <div className="bg-bg-secondary border border-border rounded-2xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-body-sm text-error">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? <Spinner size={18} /> : "Save and continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
