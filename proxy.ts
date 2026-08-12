import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DASHBOARD_SESSION_COOKIE, DASHBOARD_SESSION_VALUE } from "@/lib/dashboard-auth";

export function proxy(request: NextRequest) {
  const session = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  if (session === DASHBOARD_SESSION_VALUE) {
    return NextResponse.next();
  }

  const accessUrl = new URL("/dashboard-access", request.url);
  accessUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
