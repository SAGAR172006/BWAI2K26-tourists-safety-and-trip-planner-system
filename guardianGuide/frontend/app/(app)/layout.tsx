"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import SidePanel from "@/components/layout/SidePanel";
import FloatingSosButton from "@/components/sos/FloatingSosButton";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useTrips } from "@/hooks/useTrips";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setToken, setLoading } = useAuthStore();
  const { fetchTrips } = useTrips();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setToken(session.access_token);
      setUser({
        id: session.user.id,
        email: session.user.email || "",
        emailVerified: !!session.user.email_confirmed_at,
        phoneVerified: !!session.user.phone_confirmed_at,
        firstName: session.user.user_metadata?.first_name,
        lastName: session.user.user_metadata?.last_name,
        avatarUrl: session.user.user_metadata?.avatar_url,
      });
      setLoading(false);
      void fetchTrips();
    });
  }, [router, setToken, setUser, setLoading, fetchTrips]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      <TopBar />
      <SidePanel />
      <main style={{ paddingTop: 64 }}>{children}</main>
      <FloatingSosButton />
    </div>
  );
}
