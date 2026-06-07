import { afterEach, describe, expect, it } from "vitest";

import {
  assertStyleAdminWriteAllowed,
  isStyleAdminWriteEnabled,
  StyleAdminWriteDisabledError,
} from "@/server/style-admin/admin-write-guard";

describe("admin write guard", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalWriteFlag = process.env.STYLE_ADMIN_WRITE_ENABLED;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalWriteFlag === undefined) {
      delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    } else {
      process.env.STYLE_ADMIN_WRITE_ENABLED = originalWriteFlag;
    }
  });

  it("enables writes in development", () => {
    process.env.NODE_ENV = "development";
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    expect(isStyleAdminWriteEnabled()).toBe(true);
    expect(() => assertStyleAdminWriteAllowed()).not.toThrow();
  });

  it("disables writes in production by default", () => {
    process.env.NODE_ENV = "production";
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    expect(isStyleAdminWriteEnabled()).toBe(false);
    expect(() => assertStyleAdminWriteAllowed()).toThrow(StyleAdminWriteDisabledError);
  });

  it("allows production writes only with explicit env flag", () => {
    process.env.NODE_ENV = "production";
    process.env.STYLE_ADMIN_WRITE_ENABLED = "true";
    expect(isStyleAdminWriteEnabled()).toBe(true);
  });
});
