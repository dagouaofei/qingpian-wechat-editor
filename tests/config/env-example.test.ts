import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe(".env.example", () => {
  it("documents style admin auth placeholders without real secrets", () => {
    const content = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");

    expect(content).toContain('STYLE_ADMIN_USERNAME="admin"');
    expect(content).toContain('STYLE_ADMIN_PASSWORD_HASH="CHANGE_ME_GENERATED_HASH"');
    expect(content).toContain('STYLE_ADMIN_SESSION_SECRET="CHANGE_ME_LONG_RANDOM_SECRET"');
    expect(content).toContain('STYLE_ADMIN_WRITE_ENABLED="false"');
    expect(content).not.toMatch(/postgresql:\/\/[^U][^"]+@/);
  });
});
