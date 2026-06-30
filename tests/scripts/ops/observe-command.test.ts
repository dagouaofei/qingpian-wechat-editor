import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function readRepoFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

describe("ops observe command wiring", () => {
  const commonSh = readRepoFile("scripts/ops/common.sh");
  const observeSh = readRepoFile("scripts/ops/observe-environment.sh");
  const observeChecksSh = readRepoFile("scripts/ops/observe-checks.sh");
  const statusSh = readRepoFile("scripts/ops/status-environment.sh");
  const packageJson = readRepoFile("package.json");

  it("reuses status-environment.sh before strict checks", () => {
    expect(observeSh).toContain('bash "${SCRIPT_DIR}/status-environment.sh" "${OPS_ENV_NAME}"');
    expect(observeSh).toContain("observe_assert_systemd_active");
    expect(observeSh).toContain("observe_check_public_http_surface");
  });

  it("does not print secrets or env file contents", () => {
    for (const source of [observeSh, observeChecksSh]) {
      expect(source).not.toMatch(/DATABASE_URL|STYLE_ADMIN_SESSION_SECRET|password/i);
      expect(source).not.toContain("source \"${OPS_ENV_FILE}\"");
      expect(source).not.toContain("cat ${OPS_ENV_FILE}");
    }
  });

  it("exits non-zero when strict checks fail", () => {
    expect(observeSh).toContain('exit 1');
    expect(observeSh).toContain("OBSERVE_FAILURES");
    expect(observeChecksSh).toContain("OBSERVE_FAILURES");
  });

  it.each(["staging", "production"] as const)(
    "routes %s through observe-environment.sh package script",
    (environment) => {
      expect(packageJson).toContain(
        `"ops:observe:${environment}": "bash scripts/ops/observe-environment.sh ${environment}"`,
      );
    },
  );

  it("sets canonical public URLs per environment", () => {
    expect(commonSh).toContain("https://staging.qingpianai.cn");
    expect(commonSh).toContain("https://paiban.aiqingpian.cn");
  });

  it("status script remains the baseline status path", () => {
    expect(statusSh).toContain("print_systemd_status");
    expect(observeSh).not.toContain("print_systemd_status");
  });
});
