import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side (public) Supabase config — VITE_ prefix is required for Vite to inject them.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase client keys are not set. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured for the client.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client factory.
// IMPORTANT: Do NOT expose your service role key to client bundles. This function will throw if called in the browser.
export function getAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getAdminClient() called in browser: admin client must only be created on the server. Use a server-side endpoint.');
  }

  // Prefer server environment variable without VITE_ prefix (set this in your deployment environment)
  const serviceKey = ((globalThis as any)?.process?.env?.SUPABASE_SERVICE_KEY as string) || (import.meta.env.SUPABASE_SERVICE_KEY as string) || '';
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_KEY is not set in the server environment. Set SUPABASE_SERVICE_KEY on the server.');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'sb-admin-auth-token',
    },
  });
}

// Helpers for common tables (use client for public reads/writes; admin-level operations must be done server-side)
export const db = {
  profiles: () => supabase.from('profiles'),
  challenges: () => supabase.from('challenges'),
};
