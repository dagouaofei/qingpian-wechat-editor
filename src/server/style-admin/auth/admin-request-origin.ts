import type { NextRequest } from "next/server";

function firstHeaderValue(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const first = value.split(",")[0]?.trim();
  return first && first.length > 0 ? first : null;
}

function parseConfiguredAdminPublicOrigin(): string | null {
  const raw = process.env.STYLE_ADMIN_PUBLIC_ORIGIN?.trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = new URL(raw);
    if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
      return null;
    }
    if (parsed.username || parsed.password) {
      return null;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function isTrustedForwardedHost(host: string): boolean {
  if (!host || host.length > 253) {
    return false;
  }
  if (/[\s@/\\]/.test(host) || host.includes("://")) {
    return false;
  }

  return /^(?:[a-zA-Z0-9.-]+|\[[0-9a-f:]+\])(?::\d{1,5})?$/.test(host);
}

export function resolveAdminPublicOrigin(input: {
  headers: Headers;
  fallbackOrigin: string;
}): string {
  const configured = parseConfiguredAdminPublicOrigin();
  if (configured) {
    return configured;
  }

  const forwardedProto = firstHeaderValue(input.headers.get("x-forwarded-proto"))?.toLowerCase();
  const forwardedHost = firstHeaderValue(input.headers.get("x-forwarded-host"));

  if (forwardedProto === "https" && forwardedHost && isTrustedForwardedHost(forwardedHost)) {
    return `https://${forwardedHost}`;
  }

  return input.fallbackOrigin;
}

export function resolveAdminPublicOriginFromRequest(request: NextRequest): string {
  return resolveAdminPublicOrigin({
    headers: request.headers,
    fallbackOrigin: request.nextUrl.origin,
  });
}

export function resolveAdminSessionCookieSecure(input?: {
  headers: Headers;
}): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const configured = parseConfiguredAdminPublicOrigin();
  if (configured?.startsWith("https://")) {
    return true;
  }

  const forwardedProto = input
    ? firstHeaderValue(input.headers.get("x-forwarded-proto"))?.toLowerCase()
    : null;

  if (forwardedProto === "http") {
    return false;
  }

  return true;
}
