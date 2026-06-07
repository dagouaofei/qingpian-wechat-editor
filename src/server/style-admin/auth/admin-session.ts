import { createHmac, timingSafeEqual } from "node:crypto";

import type { StyleAdminSessionPayload } from "./admin-auth-types";

export const STYLE_ADMIN_SESSION_COOKIE = "style_admin_session";

function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Buffer | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, "base64");
  } catch {
    return null;
  }
}

function signSessionPayload(payloadBase64: string, secret: string): string {
  return toBase64Url(createHmac("sha256", secret).update(payloadBase64).digest());
}

export function createAdminSessionToken(input: {
  username: string;
  sessionSecret: string;
  sessionTtlSeconds: number;
  now?: number;
}): string {
  const now = input.now ?? Math.floor(Date.now() / 1000);
  const payload: StyleAdminSessionPayload = {
    username: input.username,
    iat: now,
    exp: now + input.sessionTtlSeconds,
  };
  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = signSessionPayload(payloadBase64, input.sessionSecret);
  return `${payloadBase64}.${signature}`;
}

export function verifyAdminSessionToken(input: {
  token: string | null | undefined;
  sessionSecret: string;
  now?: number;
}): StyleAdminSessionPayload | null {
  if (!input.token || !input.sessionSecret) {
    return null;
  }

  const [payloadBase64, signature] = input.token.split(".");
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payloadBase64, input.sessionSecret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payloadBuffer = fromBase64Url(payloadBase64);
  if (!payloadBuffer) {
    return null;
  }

  let payload: StyleAdminSessionPayload;
  try {
    payload = JSON.parse(payloadBuffer.toString("utf8")) as StyleAdminSessionPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.username !== "string" ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }

  const now = input.now ?? Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    return null;
  }

  return payload;
}

export function getStyleAdminSessionCookieOptions(input: {
  sessionTtlSeconds: number;
  secure: boolean;
}) {
  return {
    httpOnly: true,
    secure: input.secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: input.sessionTtlSeconds,
  };
}
