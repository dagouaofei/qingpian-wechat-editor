import { afterEach, describe, expect, it } from "vitest";

import {
  resolveAdminPublicOrigin,
  resolveAdminSessionCookieSecure,
} from "@/server/style-admin/auth/admin-request-origin";

describe("admin request origin helpers", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("prefers forwarded proto and host for public redirects", () => {
    const headers = new Headers({
      host: "127.0.0.1:3000",
      "x-forwarded-proto": "https",
      "x-forwarded-host": "staging.qingpianai.cn",
    });

    expect(
      resolveAdminPublicOrigin({
        headers,
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("https://staging.qingpianai.cn");
  });

  it("uses the first forwarded proto when proxies append values", () => {
    const headers = new Headers({
      host: "127.0.0.1:3000",
      "x-forwarded-proto": "https,http",
      "x-forwarded-host": "staging.qingpianai.cn",
    });

    expect(
      resolveAdminPublicOrigin({
        headers,
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("https://staging.qingpianai.cn");
  });

  it("prefers STYLE_ADMIN_PUBLIC_ORIGIN over forwarded headers", () => {
    process.env.STYLE_ADMIN_PUBLIC_ORIGIN = "https://staging.qingpianai.cn";

    expect(
      resolveAdminPublicOrigin({
        headers: new Headers({
          host: "evil.example",
          "x-forwarded-proto": "https",
          "x-forwarded-host": "evil.example",
        }),
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("https://staging.qingpianai.cn");
  });

  it("ignores hostile Host headers without trusted forwarded proto", () => {
    expect(
      resolveAdminPublicOrigin({
        headers: new Headers({
          host: "evil.example",
        }),
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("http://127.0.0.1:3000");
  });

  it("ignores forwarded host when proto is http", () => {
    expect(
      resolveAdminPublicOrigin({
        headers: new Headers({
          host: "127.0.0.1:3000",
          "x-forwarded-proto": "http",
          "x-forwarded-host": "evil.example",
        }),
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("http://127.0.0.1:3000");
  });

  it("rejects malformed forwarded host values", () => {
    expect(
      resolveAdminPublicOrigin({
        headers: new Headers({
          "x-forwarded-proto": "https",
          "x-forwarded-host": "evil.example/admin",
        }),
        fallbackOrigin: "http://127.0.0.1:3000",
      }),
    ).toBe("http://127.0.0.1:3000");
  });

  it("marks cookies secure in production when forwarded proto is https", () => {
    process.env.NODE_ENV = "production";

    expect(
      resolveAdminSessionCookieSecure({
        headers: new Headers({ "x-forwarded-proto": "https" }),
      }),
    ).toBe(true);
  });

  it("marks cookies secure when STYLE_ADMIN_PUBLIC_ORIGIN is https", () => {
    process.env.NODE_ENV = "production";
    process.env.STYLE_ADMIN_PUBLIC_ORIGIN = "https://staging.qingpianai.cn";

    expect(resolveAdminSessionCookieSecure()).toBe(true);
  });

  it("does not mark cookies secure when forwarded proto is http in production", () => {
    process.env.NODE_ENV = "production";

    expect(
      resolveAdminSessionCookieSecure({
        headers: new Headers({ "x-forwarded-proto": "http" }),
      }),
    ).toBe(false);
  });
});
