import { describe, expect, it } from "vitest";

import {
  hashAdminPassword,
  verifyAdminPassword,
} from "@/server/style-admin/auth/admin-password";

describe("admin password", () => {
  it("verifies a valid password against its hash", () => {
    const hash = hashAdminPassword("local-dev-password");
    expect(verifyAdminPassword("local-dev-password", hash)).toBe(true);
  });

  it("rejects an invalid password", () => {
    const hash = hashAdminPassword("local-dev-password");
    expect(verifyAdminPassword("wrong-password", hash)).toBe(false);
  });

  it("rejects malformed hash values", () => {
    expect(verifyAdminPassword("password", "not-a-valid-hash")).toBe(false);
  });
});
