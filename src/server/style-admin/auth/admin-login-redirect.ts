import type { NextRequest } from "next/server";

import { sanitizeAdminNextPath } from "./admin-auth";
import { resolveAdminPublicOriginFromRequest } from "./admin-request-origin";

function sanitizeLoginRedirectSearchParams(searchParams?: URLSearchParams): URLSearchParams | undefined {
  if (!searchParams?.has("next")) {
    return searchParams;
  }

  const params = new URLSearchParams(searchParams);
  params.set("next", sanitizeAdminNextPath(params.get("next")));
  return params;
}

export function buildAdminLoginRedirectUrl(
  request: NextRequest,
  pathname: string,
  searchParams?: URLSearchParams,
): URL {
  const safePath =
    pathname === "/admin/login" ? "/admin/login" : sanitizeAdminNextPath(pathname);
  const origin = resolveAdminPublicOriginFromRequest(request);
  const url = new URL(safePath, origin);

  if (url.origin !== origin || !url.pathname.startsWith("/admin")) {
    return new URL("/admin/style-library", origin);
  }

  const safeSearchParams = sanitizeLoginRedirectSearchParams(searchParams);
  if (safeSearchParams) {
    url.search = safeSearchParams.toString();
  }

  return url;
}
