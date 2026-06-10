import { NextRequest, NextResponse } from "next/server";

import { buildAdminLoginRedirectUrl } from "@/server/style-admin/auth/admin-login-redirect";
import { resolveAdminSessionCookieSecure } from "@/server/style-admin/auth/admin-request-origin";
import { STYLE_ADMIN_SESSION_COOKIE } from "@/server/style-admin/auth/admin-session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(buildAdminLoginRedirectUrl(request, "/admin/login"), {
    status: 303,
  });
  response.cookies.set(STYLE_ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: resolveAdminSessionCookieSecure({ headers: request.headers }),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
