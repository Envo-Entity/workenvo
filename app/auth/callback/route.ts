import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles OAuth redirect callbacks (e.g. Google SSO added later).
// OTP code flow is verified client-side so this route isn't called for OTP.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = new URL(next, origin);
      // Only allow same-origin redirects.
      if (redirectUrl.origin === origin) {
        return Response.redirect(redirectUrl.toString());
      }
    }
  }

  return Response.redirect(new URL("/login?error=auth_failed", origin));
}
