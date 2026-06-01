import {
  formatVolcengineSmokeSummary,
  runVolcengineProviderSmoke,
} from "../../src/core/generation/volcengine-provider-smoke";
import {
  loadDevEnvFiles,
  printVolcengineSmokeSetupHelp,
} from "../../src/core/generation/smoke-env";

async function main(): Promise<number> {
  const loadedFiles = loadDevEnvFiles();
  if (loadedFiles.length > 0) {
    console.error(`Loaded env files: ${loadedFiles.join(", ")}`);
  }

  const summary = await runVolcengineProviderSmoke(process.env);
  console.log(formatVolcengineSmokeSummary(summary));

  if (!summary.ok && summary.failureCategory === "config") {
    printVolcengineSmokeSetupHelp();
  }

  return summary.ok ? 0 : 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Volcengine provider smoke crashed: ${message}`);
  process.exit(1);
});
