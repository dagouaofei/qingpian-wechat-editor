import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = resolve(__dirname, "../../../..");

describe("admin protected layout logout UI", () => {
  it("uses POST /api/admin/logout instead of a prefetchable GET logout link", () => {
    const layoutSource = readFileSync(
      resolve(repoRoot, "src/app/admin/(protected)/layout.tsx"),
      "utf8",
    );

    expect(layoutSource).toContain('action="/api/admin/logout"');
    expect(layoutSource).toContain('method="POST"');
    expect(layoutSource).not.toContain('href="/admin/logout"');
    expect(layoutSource).not.toMatch(/<Link[^>]+href="\/admin\/logout"/);
  });
});

describe("admin logout page", () => {
  it("does not clear session on GET and delegates logout to POST /api/admin/logout", () => {
    const pageSource = readFileSync(
      resolve(repoRoot, "src/app/admin/(auth)/logout/page.tsx"),
      "utf8",
    );

    expect(pageSource).not.toContain("clearAdminSession");
    expect(pageSource).toContain('action="/api/admin/logout"');
    expect(pageSource).toContain('method="POST"');
  });

  it("does not expose a GET route handler that mutates session", () => {
    expect(() =>
      readFileSync(resolve(repoRoot, "src/app/admin/(auth)/logout/route.ts"), "utf8"),
    ).toThrow();
  });
});
