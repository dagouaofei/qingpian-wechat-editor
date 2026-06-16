import { readFileSync } from "node:fs";
import path from "node:path";

import {
  importGovernanceSnapshot,
  parseGovernanceSnapshot,
} from "@/server/style-admin/governance";
import { prisma } from "@/server/style-admin/prisma";

function parseArgs(argv: string[]): { dryRun: boolean; snapshotPath?: string } {
  const dryRun = argv.includes("--dry-run");
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const snapshotPath = positional[0];
  return { dryRun, snapshotPath };
}

async function main(): Promise<void> {
  const { dryRun, snapshotPath } = parseArgs(process.argv.slice(2));

  if (!snapshotPath) {
    console.error(
      "Usage: pnpm style-admin:import-governance-snapshot[:dry-run] -- <snapshot.json>",
    );
    process.exit(1);
  }

  if (!dryRun && !process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is required for apply import. Use --dry-run to preview without DB writes.",
    );
    process.exit(1);
  }

  const absolutePath = path.resolve(snapshotPath);
  const raw = JSON.parse(readFileSync(absolutePath, "utf8")) as unknown;
  const snapshot = parseGovernanceSnapshot(raw);

  const result = await importGovernanceSnapshot(prisma, snapshot, {
    dryRun,
    actor: "governance-snapshot-import-script",
  });

  console.log(result.summary);
  console.log(JSON.stringify(result.report, null, 2));

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
