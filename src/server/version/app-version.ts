import { readFileSync } from "node:fs";
import { join } from "node:path";

export type AppVersionInfo = {
  service: "qingpian-wechat-editor";
  environment: string;
  appVersion: string;
  gitSha: string;
  buildTime: string;
};

type BuildMetadataFile = Partial<AppVersionInfo>;

const SERVICE_NAME = "qingpian-wechat-editor" as const;

function readBuildMetadataFile(): BuildMetadataFile | null {
  try {
    const path = join(process.cwd(), "src/generated/build-metadata.json");
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as BuildMetadataFile;
  } catch {
    return null;
  }
}

function normalizeGitSha(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "unknown";
  }
  return trimmed.slice(0, 12);
}

function resolveEnvironment(fileEnv: string | undefined): string {
  const fromFile = fileEnv?.trim();
  if (fromFile && fromFile !== "unknown") {
    return fromFile;
  }
  const fromEnv = process.env.APP_ENV?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    return "production";
  }
  if (process.env.NODE_ENV === "test") {
    return "test";
  }
  return "dev";
}

/** Build-time metadata only — never shells out to git at request time. */
export function getAppVersionInfo(): AppVersionInfo {
  const file = readBuildMetadataFile();

  return {
    service: SERVICE_NAME,
    environment: resolveEnvironment(
      process.env.APP_ENV?.trim() || file?.environment,
    ),
    appVersion:
      process.env.APP_VERSION?.trim() ||
      file?.appVersion?.trim() ||
      "release-1",
    gitSha: normalizeGitSha(file?.gitSha ?? process.env.APP_GIT_SHA),
    buildTime:
      file?.buildTime?.trim() ||
      process.env.APP_BUILD_TIME?.trim() ||
      "unknown",
  };
}

/** Admin footer: `production · 8da62e9 · build 2026-06-16 10:30` (UTC). */
export function formatAppVersionForAdminFooter(info: AppVersionInfo): string {
  const buildLabel = formatBuildTimeForDisplay(info.buildTime);
  return `${info.environment} · ${info.gitSha} · build ${buildLabel}`;
}

export function formatBuildTimeForDisplay(buildTime: string): string {
  if (buildTime === "unknown") {
    return "unknown";
  }
  const date = new Date(buildTime);
  if (Number.isNaN(date.getTime())) {
    return buildTime;
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}
