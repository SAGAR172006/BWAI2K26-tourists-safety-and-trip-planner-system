import { getSupabaseBrowser } from "./supabaseClient";

/**
 * Initiates Google OAuth sign-in via Supabase.
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo ?? `${window.location.origin}/home`,
      scopes: "email profile",
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Initiates Google OAuth with extended Gmail scopes for Credentials Vault.
 */
export async function signInWithGmailScope(redirectTo?: string) {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo ?? `${window.location.origin}/user`,
      scopes: "email profile https://www.googleapis.com/auth/gmail.readonly",
    },
  });

  if (error) throw error;
  return data;
}
