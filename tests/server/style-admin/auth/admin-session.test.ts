import { describe, expect, it } from "vitest";

import {
  createAdminSessionToken,
  getStyleAdminSessionCookieOptions,
  verifyAdminSessionToken,
} from "@/server/style-admin/auth/admin-session";

describe("admin session", () => {
  const secret = "test-session-secret-value";

  it("creates and verifies a session token", () => {
    const token = createAdminSessionToken({
      username: "admin",
      sessionSecret: secret,
      sessionTtlSeconds: 3600,
      now: 1_700_000_000,
    });

    const payload = verifyAdminSessionToken({
      token,
      sessionSecret: secret,
      now: 1_700_000_100,
    });

    expect(payload).toEqual({
      username: "admin",
      iat: 1_700_000_000,
      exp: 1_700_003_600,
    });
  });

  it("rejects expired sessions", () => {
    const token = createAdminSessionToken({
      username: "admin",
      sessionSecret: secret,
      sessionTtlSeconds: 60,
      now: 1_700_000_000,
    });

    expect(
      verifyAdminSessionToken({
        token,
        sessionSecret: secret,
        now: 1_700_000_200,
      }),
    ).toBeNull();
  });

  it("rejects tampered session tokens", () => {
    const token = createAdminSessionToken({
      username: "admin",
      sessionSecret: secret,
      sessionTtlSeconds: 3600,
      now: 1_700_000_000,
    });

    expect(
      verifyAdminSessionToken({
        token: `${token}x`,
        sessionSecret: secret,
        now: 1_700_000_100,
      }),
    ).toBeNull();
  });

  it("uses secure cookies in production", () => {
    const options = getStyleAdminSessionCookieOptions({
      sessionTtlSeconds: 3600,
      secure: true,
    });
    expect(options.secure).toBe(true);
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
  });
});
