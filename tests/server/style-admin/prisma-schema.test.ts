import { execSync } from "node:child_process";
import path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(__dirname, "../../..");

describe("prisma schema", () => {
  it("validates against PostgreSQL datasource", () => {
    expect(() => {
      execSync("./node_modules/.bin/prisma validate", {
        cwd: projectRoot,
        stdio: "pipe",
        env: {
          ...process.env,
          DATABASE_URL:
            "postgresql://user:pass@localhost:5432/qingpian_dev?schema=public",
        },
      });
    }).not.toThrow();
  });
});
