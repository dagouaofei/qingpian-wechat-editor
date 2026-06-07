import type { StyleVariant, StyleVariantVersion } from "@prisma/client";

import { isBlockingQualityStatus } from "@/lib/runtime-variant-availability";
import type { RuntimeVariantPoolIssue } from "./user-selectable-variant-pool-types";

type DbRuntimeDslRow = StyleVariant & {
  distribution: {
    hidden: boolean;
    deprecated: boolean;
  } | null;
  currentVersion: StyleVariantVersion | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mapDbRowToRuntimeDslDefinition(row: DbRuntimeDslRow): {
  included: boolean;
  definitionJson?: unknown;
  issue?: RuntimeVariantPoolIssue;
} {
  if (row.lifecycle === "deprecated") {
    return {
      included: false,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "deprecated_lifecycle",
        message: "Deprecated lifecycle variants are excluded from runtime DSL pool",
      },
    };
  }

  if (!row.distribution || row.distribution.hidden || row.distribution.deprecated) {
    return {
      included: false,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "ineligible_distribution",
        message: "Variant is hidden or deprecated in distribution",
      },
    };
  }

  if (!row.currentVersion) {
    return {
      included: false,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "missing_current_version",
        message: "Missing current version",
      },
    };
  }

  if (isBlockingQualityStatus(row.currentVersion.qualityStatus)) {
    return {
      included: false,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "ineligible_distribution",
        message: `Variant blocked by qualityStatus=${row.currentVersion.qualityStatus}`,
      },
    };
  }

  const definitionJson = row.currentVersion.definitionJson;
  if (!isRecord(definitionJson)) {
    return {
      included: false,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "invalid_definition",
        message: "definitionJson is not an object",
      },
    };
  }

  return {
    included: true,
    definitionJson,
  };
}
