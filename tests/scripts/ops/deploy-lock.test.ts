import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

const STAGING_LOCK = "/tmp/qingpian-wechat-editor-staging-deploy.lock";
const PRODUCTION_LOCK = "/tmp/qingpian-wechat-editor-production-deploy.lock";

function readRepoFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

function hasFlockCommand(): boolean {
  try {
    execSync("command -v flock", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

describe("ops deploy lock paths", () => {
  const commonSh = readRepoFile("scripts/ops/common.sh");
  const deploySh = readRepoFile("scripts/ops/deploy-environment.sh");
  const rollbackSh = readRepoFile("scripts/ops/rollback-environment.sh");

  it("uses canonical lock files outside the app directory", () => {
    expect(commonSh).toContain(
      `OPS_CANONICAL_STAGING_LOCK_FILE="${STAGING_LOCK}"`,
    );
    expect(commonSh).toContain(
      `OPS_CANONICAL_PRODUCTION_LOCK_FILE="${PRODUCTION_LOCK}"`,
    );
    expect(STAGING_LOCK).not.toBe(PRODUCTION_LOCK);
    expect(STAGING_LOCK.startsWith("/tmp/")).toBe(true);
    expect(PRODUCTION_LOCK.startsWith("/tmp/")).toBe(true);
  });

  it("does not create in-repo .deploy.lock paths", () => {
    expect(commonSh).not.toContain('OPS_APP_DIR}/.deploy.lock');
    expect(commonSh).not.toContain("${OPS_APP_DIR}/.deploy.lock");
    expect(deploySh).not.toContain(".deploy.lock");
    expect(rollbackSh).not.toContain(".deploy.lock");
  });

  it("checks worktree before acquiring deploy lock", () => {
    const deployWorktreeIndex = deploySh.indexOf("require_acceptable_worktree");
    const deployLockIndex = deploySh.indexOf("acquire_deploy_lock");
    expect(deployWorktreeIndex).toBeGreaterThan(-1);
    expect(deployLockIndex).toBeGreaterThan(deployWorktreeIndex);

    const rollbackWorktreeIndex = rollbackSh.indexOf(
      "require_acceptable_worktree",
    );
    const rollbackLockIndex = rollbackSh.indexOf("acquire_deploy_lock");
    expect(rollbackWorktreeIndex).toBeGreaterThan(-1);
    expect(rollbackLockIndex).toBeGreaterThan(rollbackWorktreeIndex);
  });

  it.runIf(hasFlockCommand())(
    "does not create .deploy.lock in a clean git worktree when lock is acquired",
    () => {
    const appDir = mkdtempSync(join(tmpdir(), "qingpian-ops-lock-"));
    const lockFile = join(tmpdir(), `qingpian-test-staging-deploy-${process.pid}.lock`);

    try {
      execSync("git init", { cwd: appDir, stdio: "ignore" });
      execSync("git commit --allow-empty -m init", {
        cwd: appDir,
        stdio: "ignore",
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "test",
          GIT_AUTHOR_EMAIL: "test@example.com",
          GIT_COMMITTER_NAME: "test",
          GIT_COMMITTER_EMAIL: "test@example.com",
        },
      });

      execSync(
        `
          set -euo pipefail
          OPS_ENV_NAME=staging
          OPS_APP_DIR="${appDir}"
          OPS_LOCK_FILE="${lockFile}"
          source "${join(ROOT, "scripts/ops/common.sh")}"
          resolve_environment_config staging
          require_acceptable_worktree
          acquire_deploy_lock
          release_deploy_lock
        `,
        { shell: "/bin/bash", stdio: "pipe" },
      );

      expect(existsSync(join(appDir, ".deploy.lock"))).toBe(false);
      expect(existsSync(lockFile)).toBe(true);
    } finally {
      rmSync(appDir, { recursive: true, force: true });
      if (existsSync(lockFile)) {
        rmSync(lockFile, { force: true });
      }
    }
  },
  );
});
