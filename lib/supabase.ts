import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;

// Server-side client: prefers service role key so RLS is bypassed for trusted server operations.
// Falls back to anon key for local dev without service role configured.
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set");

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
