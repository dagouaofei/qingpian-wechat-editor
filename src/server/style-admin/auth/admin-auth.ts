import { cookies, headers } from "next/headers";

import { resolveAdminSessionCookieSecure } from "./admin-request-origin";
import { getStyleAdminAuthConfig, isStyleAdminAuthConfigured } from "./admin-auth-config";
import type { StyleAdminIdentity } from "./admin-auth-types";
import { verifyAdminPassword } from "./admin-password";
import {
  createAdminSessionToken,
  getStyleAdminSessionCookieOptions,
  STYLE_ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "./admin-session";

export const STYLE_ADMIN_AUTH_ENABLED_MESSAGE =
  "Single-admin authentication is enabled for /admin/* pages and write actions.";

export const STYLE_ADMIN_AUTH_REQUIRED_MESSAGE =
  "Admin authentication is required for this action.";

export class StyleAdminAuthError extends Error {
  readonly code = "style_admin_auth_required";

  constructor(message = STYLE_ADMIN_AUTH_REQUIRED_MESSAGE) {
    super(message);
    this.name = "StyleAdminAuthError";
  }
}

export class StyleAdminAuthNotConfiguredError extends Error {
  readonly code = "style_admin_auth_not_configured";

  constructor(message = "Style admin authentication is not configured.") {
    super(message);
    this.name = "StyleAdminAuthNotConfiguredError";
  }
}

export function getStyleAdminActor(identity: StyleAdminIdentity): string {
  return identity.actor;
}

export function buildStyleAdminIdentity(username: string): StyleAdminIdentity {
  return {
    username,
    actor: `admin:${username}`,
  };
}

export function sanitizeAdminNextPath(next: string | null | undefined): string {
  const trimmed = (next ?? "").trim();
  if (!trimmed) {
    return "/admin/style-library";
  }

  let candidate = trimmed;
  if (/%[0-9a-f]{2}/i.test(trimmed)) {
    try {
      candidate = decodeURIComponent(trimmed);
    } catch {
      return "/admin/style-library";
    }
  }

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("://") ||
    candidate.includes("\\") ||
    candidate.includes("\0")
  ) {
    return "/admin/style-library";
  }
  if (!candidate.startsWith("/admin")) {
    return "/admin/style-library";
  }
  if (candidate.startsWith("/admin/login") || candidate.startsWith("/admin/logout")) {
    return "/admin/style-library";
  }
  return candidate;
}

export function verifyAdminPasswordForConfig(
  inputPassword: string,
  config = getStyleAdminAuthConfig(),
): boolean {
  if (!config.username || !config.passwordHash) {
    return false;
  }
  return verifyAdminPassword(inputPassword, config.passwordHash);
}

export function createAdminSession(
  username: string,
  config = getStyleAdminAuthConfig(),
): string {
  return createAdminSessionToken({
    username,
    sessionSecret: config.sessionSecret,
    sessionTtlSeconds: config.sessionTtlSeconds,
  });
}

export function verifyAdminSession(
  cookieValue: string | null | undefined,
  config = getStyleAdminAuthConfig(),
): StyleAdminIdentity | null {
  const payload = verifyAdminSessionToken({
    token: cookieValue,
    sessionSecret: config.sessionSecret,
  });
  if (!payload) {
    return null;
  }
  if (config.username && payload.username !== config.username) {
    return null;
  }
  return buildStyleAdminIdentity(payload.username);
}

export async function getCurrentStyleAdmin(): Promise<StyleAdminIdentity | null> {
  if (!isStyleAdminAuthConfigured()) {
    return null;
  }
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(STYLE_ADMIN_SESSION_COOKIE)?.value);
}

export async function requireStyleAdmin(): Promise<StyleAdminIdentity> {
  if (!isStyleAdminAuthConfigured()) {
    throw new StyleAdminAuthNotConfiguredError();
  }
  const admin = await getCurrentStyleAdmin();
  if (!admin) {
    throw new StyleAdminAuthError();
  }
  return admin;
}

async function resolveAdminSessionCookieSecureFromHeaders(): Promise<boolean> {
  const headerStore = await headers();
  return resolveAdminSessionCookieSecure({ headers: headerStore });
}

export async function setAdminSessionCookie(username: string): Promise<void> {
  const config = getStyleAdminAuthConfig();
  const cookieStore = await cookies();
  const token = createAdminSession(username, config);
  cookieStore.set(
    STYLE_ADMIN_SESSION_COOKIE,
    token,
    getStyleAdminSessionCookieOptions({
      sessionTtlSeconds: config.sessionTtlSeconds,
      secure: await resolveAdminSessionCookieSecureFromHeaders(),
    }),
  );
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(STYLE_ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: await resolveAdminSessionCookieSecureFromHeaders(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminLoginRedirectPath(): Promise<string> {
  const headerStore = await headers();
  const pathname = headerStore.get("x-admin-pathname");
  return sanitizeAdminNextPath(pathname);
}
