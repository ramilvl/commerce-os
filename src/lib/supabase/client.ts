import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Reads public env vars.
 * In local/demo mode without env vars configured, the app falls back to the
 * in-memory mock data layer (see src/lib/mock) so the UI is fully explorable
 * without a live Supabase project.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars are not set. CommerceOS is running in demo/mock mode — see README.md."
    );
  }

  return createBrowserClient(url, anonKey);
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
