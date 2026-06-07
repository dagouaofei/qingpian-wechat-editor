import { afterEach, describe, expect, it } from "vitest";

import { isDevApiEnabled } from "@/lib/dev-api-env";

describe("isDevApiEnabled", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("enables dev APIs in development", () => {
    process.env.NODE_ENV = "development";
    expect(isDevApiEnabled()).toBe(true);
  });

  it("enables dev APIs in test", () => {
    process.env.NODE_ENV = "test";
    expect(isDevApiEnabled()).toBe(true);
  });

  it("disables dev APIs in production", () => {
    process.env.NODE_ENV = "production";
    expect(isDevApiEnabled()).toBe(false);
  });

  it("disables dev APIs in other deploy environments", () => {
    process.env.NODE_ENV = "staging";
    expect(isDevApiEnabled()).toBe(false);
  });
});
