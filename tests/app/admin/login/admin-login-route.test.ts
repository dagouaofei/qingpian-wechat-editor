import { afterEach, describe, expect, it, vi } from "vitest";

import { hashAdminPassword } from "@/server/style-admin/auth/admin-password";
import {
  getStyleAdminSessionCookieOptions,
  STYLE_ADMIN_SESSION_COOKIE,
} from "@/server/style-admin/auth/admin-session";

const { NextResponse } = vi.hoisted(() => ({
  NextResponse: {
    redirect: vi.fn((url: URL, init?: ResponseInit) => ({
      url,
      status: init?.status ?? 307,
      cookies: {
        set: vi.fn(),
      },
    })),
  },
}));

vi.mock("next/server", () => ({
  NextResponse,
}));

import { POST } from "@/app/api/admin/login/route";

describe("admin login route", () => {
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
    process.env.NODE_ENV = "production";
  }

  function buildRequest(input: Record<string, string>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(input)) {
      formData.append(key, value);
    }

    return {
      formData: async () => formData,
      headers: new Headers({
        host: "127.0.0.1:3000",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "staging.qingpianai.cn",
      }),
      nextUrl: new URL("http://127.0.0.1:3000/admin/login"),
    };
  }

  it("redirects invalid credentials without setting a session cookie", async () => {
    configureAuth("correct-password");

    const response = await POST(
      buildRequest({
        username: "admin",
        password: "wrong-password",
        next: "/admin/style-library",
      }) as never,
    );

    expect(response.url.toString()).toContain("/admin/login?error=invalid_credentials");
    expect(response.cookies.set).not.toHaveBeenCalled();
  });

  it("sets a secure session cookie and redirects with 303 See Other", async () => {
    configureAuth("correct-password");

    const response = await POST(
      buildRequest({
        username: "admin",
        password: "correct-password",
        next: "/admin/style-library",
      }) as never,
    );

    expect(response.status).toBe(303);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL), { status: 303 });
    expect(response.url.toString()).toBe("https://staging.qingpianai.cn/admin/style-library");
    expect(response.cookies.set).toHaveBeenCalledWith(
      STYLE_ADMIN_SESSION_COOKIE,
      expect.any(String),
      getStyleAdminSessionCookieOptions({
        sessionTtlSeconds: 3600,
        secure: true,
      }),
    );
  });

  it("rejects external next targets and falls back to style-library", async () => {
    configureAuth("correct-password");

    const response = await POST(
      buildRequest({
        username: "admin",
        password: "correct-password",
        next: "https://evil.example/admin/style-library",
      }) as never,
    );

    expect(response.url.toString()).toBe("https://staging.qingpianai.cn/admin/style-library");
  });

  it("ignores hostile Host headers when forwarded headers are absent", async () => {
    configureAuth("correct-password");
    process.env.STYLE_ADMIN_PUBLIC_ORIGIN = "https://staging.qingpianai.cn";

    const formData = new FormData();
    formData.append("username", "admin");
    formData.append("password", "correct-password");
    formData.append("next", "/admin/style-library");

    const response = await POST({
      formData: async () => formData,
      headers: new Headers({
        host: "evil.example",
      }),
      nextUrl: new URL("http://127.0.0.1:3000/admin/login"),
    } as never);

    expect(response.url.toString()).toBe("https://staging.qingpianai.cn/admin/style-library");
  });
});
