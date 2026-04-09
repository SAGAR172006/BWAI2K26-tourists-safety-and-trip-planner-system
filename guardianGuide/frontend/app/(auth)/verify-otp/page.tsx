"use client";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ShieldLogo from "@/components/ui/ShieldLogo";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      const { error: err } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
      if (err) throw err;
      router.push("/home");
    } catch (e: any) {
      setError(e.message || "Invalid OTP.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <ShieldLogo size={40} />
        <h1 className="text-heading-2 text-text-primary mt-3 font-semibold">Verify your phone</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Enter the 6-digit code sent to {phone}
        </p>
      </div>

      <div className="bg-bg-secondary border border-border rounded-2xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-body-sm text-error">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-heading-2 bg-bg-elevated border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-text-primary transition-all"
            />
          ))}
        </div>

        <Button fullWidth onClick={handleVerify} disabled={loading || otp.join("").length !== 6}>
          {loading ? <Spinner size={18} /> : "Verify"}
        </Button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md flex justify-center"><Spinner size={40} /></div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
