import { afterEach, describe, expect, it } from "vitest";

import {
  buildStyleAdminIdentity,
  getStyleAdminActor,
  sanitizeAdminNextPath,
  verifyAdminPasswordForConfig,
  verifyAdminSession,
} from "@/server/style-admin/auth/admin-auth";
import { hashAdminPassword } from "@/server/style-admin/auth/admin-password";
import { createAdminSessionToken } from "@/server/style-admin/auth/admin-session";

describe("admin auth helpers", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("builds actor as admin:<username>", () => {
    const identity = buildStyleAdminIdentity("ops");
    expect(getStyleAdminActor(identity)).toBe("admin:ops");
  });

  it("sanitizes unsafe next paths", () => {
    expect(sanitizeAdminNextPath("/admin/style-library/heading_short_line")).toBe(
      "/admin/style-library/heading_short_line",
    );
    expect(sanitizeAdminNextPath("https://evil.example/admin/style-library")).toBe(
      "/admin/style-library",
    );
    expect(sanitizeAdminNextPath("/admin/login")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("/preview")).toBe("/admin/style-library");
  });

  it("verifies configured admin password", () => {
    const hash = hashAdminPassword("secret-pass");
    process.env.STYLE_ADMIN_USERNAME = "admin";
    process.env.STYLE_ADMIN_PASSWORD_HASH = hash;
    process.env.STYLE_ADMIN_SESSION_SECRET = "session-secret";

    expect(verifyAdminPasswordForConfig("secret-pass")).toBe(true);
    expect(verifyAdminPasswordForConfig("wrong-pass")).toBe(false);
  });

  it("verifies session cookie for configured username", () => {
    process.env.STYLE_ADMIN_USERNAME = "admin";
    process.env.STYLE_ADMIN_PASSWORD_HASH = hashAdminPassword("secret-pass");
    process.env.STYLE_ADMIN_SESSION_SECRET = "session-secret";
    process.env.STYLE_ADMIN_SESSION_TTL_SECONDS = "3600";

    const now = Math.floor(Date.now() / 1000);
    const token = createAdminSessionToken({
      username: "admin",
      sessionSecret: "session-secret",
      sessionTtlSeconds: 3600,
      now,
    });

    expect(
      verifyAdminSession(token, {
        username: "admin",
        passwordHash: process.env.STYLE_ADMIN_PASSWORD_HASH,
        sessionSecret: "session-secret",
        sessionTtlSeconds: 3600,
      }),
    ).toEqual({
      username: "admin",
      actor: "admin:admin",
    });
  });
});
