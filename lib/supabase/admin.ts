import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely.
// NEVER import this in client components or expose to the browser.
// Use only in Server Components, Route Handlers, and Edge Functions.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
