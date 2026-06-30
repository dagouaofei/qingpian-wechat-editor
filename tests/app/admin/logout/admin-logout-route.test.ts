import { afterEach, describe, expect, it, vi } from "vitest";

import { STYLE_ADMIN_SESSION_COOKIE } from "@/server/style-admin/auth/admin-session";

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

import { POST } from "@/app/api/admin/logout/route";

describe("admin logout route", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  function buildRequest() {
    return {
      headers: new Headers({
        host: "127.0.0.1:3000",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "staging.qingpianai.cn",
      }),
      nextUrl: new URL("http://127.0.0.1:3000/admin/style-library"),
    };
  }

  it("clears the session cookie and redirects with 303 See Other", async () => {
    process.env.NODE_ENV = "production";

    const response = await POST(buildRequest() as never);

    expect(response.status).toBe(303);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL), { status: 303 });
    expect(response.url.toString()).toBe("https://staging.qingpianai.cn/admin/login");
    expect(response.cookies.set).toHaveBeenCalledWith(
      STYLE_ADMIN_SESSION_COOKIE,
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      }),
    );
  });
});
