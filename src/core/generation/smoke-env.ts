import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function parseSmokeEnvLine(line: string): [string, string] | undefined {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return undefined;
  }

  const separator = trimmed.indexOf("=");
  if (separator <= 0) {
    return undefined;
  }

  const key = trimmed.slice(0, separator).trim();
  let value = trimmed.slice(separator + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function loadDevEnvFiles(
  cwd: string = process.cwd(),
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const loaded: string[] = [];

  for (const filename of [".env.local", ".env"]) {
    const filePath = resolve(cwd, filename);
    if (!existsSync(filePath)) {
      continue;
    }

    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const parsed = parseSmokeEnvLine(line);
      if (!parsed) {
        continue;
      }
      const [key, value] = parsed;
      if (env[key] == null || env[key] === "") {
        env[key] = value;
      }
    }

    loaded.push(filename);
  }

  return loaded;
}

export function printVolcengineSmokeSetupHelp(): void {
  console.error(
    [
      "Volcengine provider smoke requires real credentials.",
      "Set the following environment variables (for example in .env.local):",
      "  VOLCENGINE_ENABLE_REAL_PROVIDER=true",
      "  VOLCENGINE_API_KEY=...",
      "  VOLCENGINE_MODEL=...",
      "Optional:",
      "  VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3",
      "  VOLCENGINE_TIMEOUT_MS=60000",
      "",
      "Run:",
      "  corepack pnpm smoke:volcengine-provider",
    ].join("\n"),
  );
}
