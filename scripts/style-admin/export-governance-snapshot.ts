import { writeFileSync } from "node:fs";
import path from "node:path";

import { exportGovernanceSnapshot } from "@/server/style-admin/governance";
import { prisma } from "@/server/style-admin/prisma";

function parseArgs(argv: string[]): { outputPath?: string } {
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const outputArg = argv.find((arg) => arg.startsWith("--output="));
  const outputPath = outputArg?.slice("--output=".length) ?? positional[0];
  return { outputPath };
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required to export governance snapshot.");
    process.exit(1);
  }

  const { outputPath } = parseArgs(process.argv.slice(2));
  const snapshot = await exportGovernanceSnapshot(prisma, {
    sourceEnvironment: process.env.APP_ENV ?? "unknown",
  });

  const json = `${JSON.stringify(snapshot, null, 2)}\n`;
  if (outputPath) {
    const absolutePath = path.resolve(outputPath);
    writeFileSync(absolutePath, json, "utf8");
    console.log(`Governance snapshot written to ${absolutePath}`);
  } else {
    process.stdout.write(json);
  }

  console.log(
    `exported=${snapshot.variantCount} · userSelectable=${snapshot.variants.filter((variant) => variant.distribution.userSelectable).length}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
