import { describe, expect, it } from "vitest";

import { sanitizeAdminNextPath } from "@/server/style-admin/auth/admin-auth";

describe("sanitizeAdminNextPath", () => {
  it("allows safe admin paths", () => {
    expect(sanitizeAdminNextPath("/admin/style-library")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("/admin/style-library/heading_short_line")).toBe(
      "/admin/style-library/heading_short_line",
    );
  });

  it("blocks absolute and protocol-relative redirects", () => {
    expect(sanitizeAdminNextPath("https://evil.example/admin")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("//evil.example/admin")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("/\\evil.example/admin")).toBe("/admin/style-library");
  });

  it("blocks encoded open redirect attempts", () => {
    expect(sanitizeAdminNextPath("%2F%2Fevil.example/admin")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("%2f%2fevil.example/admin")).toBe("/admin/style-library");
  });

  it("blocks non-admin and auth loop paths", () => {
    expect(sanitizeAdminNextPath("/preview")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("/admin/login")).toBe("/admin/style-library");
    expect(sanitizeAdminNextPath("/admin/logout")).toBe("/admin/style-library");
  });
});
