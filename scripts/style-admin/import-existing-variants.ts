import { writeFileSync } from "node:fs";
import path from "node:path";

import { importExistingStyleVariants } from "@/server/style-admin/import";
import { prisma } from "@/server/style-admin/prisma";

function parseArgs(argv: string[]): { dryRun: boolean; reportPath?: string } {
  const dryRun = argv.includes("--dry-run");
  const reportArg = argv.find((arg) => arg.startsWith("--report="));
  const reportPath = reportArg?.slice("--report=".length);
  return { dryRun, reportPath };
}

async function main(): Promise<void> {
  const { dryRun, reportPath } = parseArgs(process.argv.slice(2));

  if (!dryRun && !process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is required for apply import. Use --dry-run to preview without DB writes.",
    );
    process.exit(1);
  }

  const result = await importExistingStyleVariants(prisma, {
    dryRun,
    actor: "style-admin-import-script",
  });

  console.log(result.summary);
  console.log(JSON.stringify(result.report, null, 2));

  if (reportPath) {
    const absolutePath = path.resolve(reportPath);
    writeFileSync(absolutePath, `${JSON.stringify(result.report, null, 2)}\n`, "utf8");
    console.log(`Report written to ${absolutePath}`);
  }

  if (result.report.errors.length > 0) {
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
