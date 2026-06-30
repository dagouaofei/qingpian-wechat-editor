import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

const STAGING_ENV = "/etc/qingpian-wechat-editor-staging.env";
const PRODUCTION_ENV = "/etc/qingpian-wechat-editor-production.env";

function readRepoFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

describe("ops canonical env paths", () => {
  const commonSh = readRepoFile("scripts/ops/common.sh");
  const deploySh = readRepoFile("scripts/ops/deploy-environment.sh");
  const statusSh = readRepoFile("scripts/ops/status-environment.sh");
  const rollbackSh = readRepoFile("scripts/ops/rollback-environment.sh");
  const stagingUnit = readRepoFile(
    "deploy/systemd/qingpian-wechat-editor-staging.service.example",
  );
  const productionUnit = readRepoFile(
    "deploy/systemd/qingpian-wechat-editor-production.service.example",
  );

  it("defines distinct canonical staging and production env paths", () => {
    expect(commonSh).toContain(`OPS_CANONICAL_STAGING_ENV_FILE="${STAGING_ENV}"`);
    expect(commonSh).toContain(
      `OPS_CANONICAL_PRODUCTION_ENV_FILE="${PRODUCTION_ENV}"`,
    );
    expect(STAGING_ENV).not.toBe(PRODUCTION_ENV);
  });

  it("does not default env file to app directory .env", () => {
    expect(commonSh).not.toMatch(/OPS_APP_DIR\}\/\.env/);
    expect(commonSh).not.toMatch(/staging\/\.env/);
    expect(commonSh).not.toMatch(/production\/\.env/);
  });

  it("uses canonical paths in systemd examples", () => {
    expect(stagingUnit).toContain(`EnvironmentFile=${STAGING_ENV}`);
    expect(productionUnit).toContain(`EnvironmentFile=${PRODUCTION_ENV}`);
    expect(stagingUnit).not.toContain("/opt/qingpian-wechat-editor/staging/.env");
    expect(productionUnit).not.toContain(
      "/opt/qingpian-wechat-editor/production/.env",
    );
  });

  it("checks env file accessibility in deploy, status, and rollback scripts", () => {
    expect(deploySh).toContain("require_env_file_accessible");
    expect(statusSh).toContain("require_env_file_accessible");
    expect(rollbackSh).toContain("require_env_file_accessible");
  });

  it("loads env before prisma generate in deploy script", () => {
    const loadIndex = deploySh.indexOf("load_env_file_safely");
    const prismaIndex = deploySh.indexOf("prisma generate");
    expect(loadIndex).toBeGreaterThan(-1);
    expect(prismaIndex).toBeGreaterThan(loadIndex);
  });

  it("guards against staging/production env path mix-up", () => {
    expect(commonSh).toContain("assert_canonical_env_paths");
    expect(commonSh).toContain("staging must not use production env file");
    expect(commonSh).toContain("production must not use staging env file");
  });

  it("rejects unexpected dirty worktree at deploy start", () => {
    expect(commonSh).toContain("require_acceptable_worktree");
    expect(commonSh).toContain("pnpm-workspace.yaml");
    expect(deploySh).toContain("require_acceptable_worktree");
    expect(deploySh).toContain("restore_script_induced_worktree_changes");
  });
});
