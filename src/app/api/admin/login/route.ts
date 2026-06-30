import { NextRequest, NextResponse } from "next/server";

import {
  createAdminSession,
  getStyleAdminAuthConfig,
  isStyleAdminAuthConfigured,
  sanitizeAdminNextPath,
  verifyAdminPasswordForConfig,
} from "@/server/style-admin/auth";
import {
  getStyleAdminSessionCookieOptions,
  STYLE_ADMIN_SESSION_COOKIE,
} from "@/server/style-admin/auth/admin-session";
import {
  buildAdminLoginRedirectUrl,
} from "@/server/style-admin/auth/admin-login-redirect";
import {
  resolveAdminSessionCookieSecure,
} from "@/server/style-admin/auth/admin-request-origin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeAdminNextPath(String(formData.get("next") ?? ""));

  if (!isStyleAdminAuthConfigured()) {
    return NextResponse.redirect(
      buildAdminLoginRedirectUrl(
        request,
        "/admin/login",
        new URLSearchParams({ error: "auth_not_configured" }),
      ),
    );
  }

  const config = getStyleAdminAuthConfig();
  if (
    !username ||
    !password ||
    username !== config.username ||
    !verifyAdminPasswordForConfig(password, config)
  ) {
    const params = new URLSearchParams({
      error: "invalid_credentials",
      next,
    });
    return NextResponse.redirect(buildAdminLoginRedirectUrl(request, "/admin/login", params));
  }

  const token = createAdminSession(username, config);
  const response = NextResponse.redirect(buildAdminLoginRedirectUrl(request, next), { status: 303 });
  response.cookies.set(
    STYLE_ADMIN_SESSION_COOKIE,
    token,
    getStyleAdminSessionCookieOptions({
      sessionTtlSeconds: config.sessionTtlSeconds,
      secure: resolveAdminSessionCookieSecure({ headers: request.headers }),
    }),
  );
  return response;
}
