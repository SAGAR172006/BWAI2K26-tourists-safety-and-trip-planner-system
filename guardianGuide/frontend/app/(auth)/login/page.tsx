"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import ShieldLogo from "@/components/ui/ShieldLogo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"google" | "phone">("google");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (e: any) {
      setError(e.message || "Google login failed.");
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      const { error: err } = await supabase.auth.signInWithOtp({ phone });
      if (err) throw err;
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch (e: any) {
      setError(e.message || "Failed to send OTP.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <ShieldLogo size={48} />
        <h1
          className="text-heading-1 text-text-primary mt-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          GuardianGuide
        </h1>
        <p className="text-body-sm text-text-secondary mt-1">Travel safe, everywhere.</p>
      </div>

      {/* Card */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-8">
        <h2 className="text-heading-2 text-text-primary mb-6 font-semibold">Sign in</h2>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-body-sm text-error">
            {error}
          </div>
        )}

        {/* Google */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mb-4 flex items-center justify-center gap-3"
        >
          {loading ? <Spinner size={18} /> : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-caption text-text-muted">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Phone */}
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
          <Input
            label="Phone number"
            type="tel"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={loading || !phone}>
            {loading ? <Spinner size={18} /> : "Send OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}
