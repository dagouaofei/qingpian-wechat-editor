#!/usr/bin/env node
/**
 * Writes build-time metadata for /api/version (no runtime git calls).
 * Invoked by `pnpm build` before `next build`.
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = join(root, "src/generated");
const outFile = join(outDir, "build-metadata.json");

function resolveGitSha() {
  if (process.env.APP_GIT_SHA?.trim()) {
    return process.env.APP_GIT_SHA.trim().slice(0, 12);
  }
  try {
    return execSync("git rev-parse --short=12 HEAD", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

const metadata = {
  service: "qingpian-wechat-editor",
  environment: process.env.APP_ENV?.trim() || "unknown",
  appVersion: process.env.APP_VERSION?.trim() || "release-1",
  gitSha: resolveGitSha(),
  buildTime: process.env.APP_BUILD_TIME?.trim() || new Date().toISOString(),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
console.log(`[build-metadata] wrote ${outFile} env=${metadata.environment} sha=${metadata.gitSha}`);
