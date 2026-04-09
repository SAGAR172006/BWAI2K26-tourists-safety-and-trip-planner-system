"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

/**
 * Initializes auth state from Supabase session and listens for changes.
 */
export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const setLoading = useAuthStore((s) => s.setLoading);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          firstName: session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.last_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          emailVerified: !!session.user.email_confirmed_at,
          phoneVerified: !!session.user.phone_confirmed_at,
        });
        setToken(session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          firstName: session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.last_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          emailVerified: !!session.user.email_confirmed_at,
          phoneVerified: !!session.user.phone_confirmed_at,
        });
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setToken, setLoading]);

  const signOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  return { user, isLoading, signOut };
}
