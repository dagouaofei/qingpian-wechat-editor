import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const WORKSPACE_PATH = join(process.cwd(), "pnpm-workspace.yaml");

function readWorkspaceYaml(): string {
  return readFileSync(WORKSPACE_PATH, "utf8");
}

function parseAllowBuilds(yaml: string): Record<string, boolean | string> {
  const allowBuilds: Record<string, boolean | string> = {};
  const section = yaml.match(/^allowBuilds:\n([\s\S]*?)(?:\n\S|$)/)?.[1] ?? "";

  for (const line of section.split("\n")) {
    const match = line.match(/^\s{2}(['"]?)([^'":\n]+)\1:\s*(.+)\s*$/);
    if (!match) continue;
    const key = match[2]?.trim();
    const raw = match[3]?.trim();
    if (!key || raw === undefined) continue;
    allowBuilds[key] = raw === "true" ? true : raw === "false" ? false : raw;
  }

  return allowBuilds;
}

describe("pnpm-workspace.yaml build approvals", () => {
  const yaml = readWorkspaceYaml();
  const allowBuilds = parseAllowBuilds(yaml);

  it("allows sharp and unrs-resolver builds via allowBuilds", () => {
    expect(allowBuilds.sharp).toBe(true);
    expect(allowBuilds["unrs-resolver"]).toBe(true);
  });

  it("does not list sharp or unrs-resolver under ignoredBuiltDependencies", () => {
    expect(yaml).not.toMatch(/ignoredBuiltDependencies:[\s\S]*sharp/);
    expect(yaml).not.toMatch(/ignoredBuiltDependencies:[\s\S]*unrs-resolver/);
    expect(yaml).not.toContain("ignoredBuiltDependencies:");
  });

  it("has no pnpm approve-builds placeholder values", () => {
    expect(yaml).not.toContain("set this to true or false");
  });

  it("does not allow and ignore the same package", () => {
    if (yaml.includes("ignoredBuiltDependencies:")) {
      const ignored = yaml.match(/ignoredBuiltDependencies:\n((?:\s+-\s+.+\n?)*)/)?.[1] ?? "";
      for (const pkg of Object.keys(allowBuilds)) {
        expect(ignored).not.toContain(pkg);
      }
    }
  });
});
