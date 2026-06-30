import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function readRepoFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

describe("ops status command wiring", () => {
  const commonSh = readRepoFile("scripts/ops/common.sh");
  const deploySh = readRepoFile("scripts/ops/deploy-environment.sh");
  const rollbackSh = readRepoFile("scripts/ops/rollback-environment.sh");
  const statusSh = readRepoFile("scripts/ops/status-environment.sh");
  const packageJson = readRepoFile("package.json");

  it("uses shared print_environment_status backed by status-environment.sh", () => {
    expect(commonSh).toContain("print_environment_status()");
    expect(commonSh).toContain(
      'bash "${OPS_SCRIPT_DIR}/status-environment.sh" "${OPS_ENV_NAME}"',
    );
  });

  it("does not invoke invalid pnpm ops:status package script", () => {
    for (const source of [commonSh, deploySh, rollbackSh, statusSh]) {
      expect(source).not.toMatch(/pnpm ops:status[^:a-z-]/);
      expect(source).not.toContain("pnpm ops:status\n");
      expect(source).not.toContain('pnpm ops:status"');
      expect(source).not.toContain("corepack pnpm ops:status");
    }
  });

  it("deploy and rollback end with print_environment_status", () => {
    expect(deploySh).toContain("print_environment_status");
    expect(rollbackSh).toContain("print_environment_status");
    expect(deploySh).not.toContain("print_systemd_status");
    expect(rollbackSh).not.toContain("print_systemd_status");
  });

  it.each(["staging", "production"] as const)(
    "routes %s through status-environment.sh and package script",
    (environment) => {
      expect(packageJson).toContain(
        `"ops:status:${environment}": "bash scripts/ops/status-environment.sh ${environment}"`,
      );
      expect(commonSh).toContain("staging|production");
    },
  );
});
