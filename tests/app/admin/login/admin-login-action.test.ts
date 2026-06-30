import { afterEach, describe, expect, it, vi } from "vitest";

import { hashAdminPassword } from "@/server/style-admin/auth/admin-password";
import { sanitizeAdminNextPath } from "@/server/style-admin/auth/admin-auth";

const { setAdminSessionCookie } = vi.hoisted(() => ({
  setAdminSessionCookie: vi.fn(),
}));

vi.mock("@/server/style-admin/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/style-admin/auth")>();
  return {
    ...actual,
    setAdminSessionCookie,
  };
});

import { loginAdminAction } from "@/app/admin/(auth)/login/actions";

describe("loginAdminAction", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  function configureAuth(password: string) {
    process.env.STYLE_ADMIN_USERNAME = "admin";
    process.env.STYLE_ADMIN_PASSWORD_HASH = hashAdminPassword(password);
    process.env.STYLE_ADMIN_SESSION_SECRET = "session-secret";
    process.env.STYLE_ADMIN_SESSION_TTL_SECONDS = "3600";
  }

  it("rejects invalid credentials without redirecting", async () => {
    configureAuth("correct-password");

    const result = await loginAdminAction({
      username: "admin",
      password: "wrong-password",
      next: "/admin/style-library",
    });

    expect(result).toEqual({
      ok: false,
      message: "Invalid username or password.",
    });
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });

  it("creates a session and returns a safe redirect path", async () => {
    configureAuth("correct-password");

    const result = await loginAdminAction({
      username: "admin",
      password: "correct-password",
      next: "/admin/style-library/heading_short_line",
    });

    expect(result).toEqual({
      ok: true,
      redirectTo: "/admin/style-library/heading_short_line",
    });
    expect(setAdminSessionCookie).toHaveBeenCalledWith("admin");
  });

  it("blocks open redirect next paths", () => {
    expect(sanitizeAdminNextPath("https://evil.example/admin")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("//evil.example/admin")).toBe("/admin/style-library");
  });
});
