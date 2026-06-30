import type { BlockType, CopySafetyTier, StyleVariant, StyleVariantVersion } from "@prisma/client";

import { isVariantDslV1 } from "@/core/dsl/runtime";
import type { CopySafety, VariantDefinition, VariantStatus } from "@/core/styles/types";
import { STYLE_SCHEMA_VERSION } from "@/core/styles/types";

import {
  evaluateUserSelectablePoolMembership,
} from "@/lib/user-selectable-pool-eligibility";
import type { RuntimeVariantPoolIssue } from "./user-selectable-variant-pool-types";

type DbPoolRow = StyleVariant & {
  distribution: {
    userSelectable: boolean;
    defaultEligible: boolean;
    release1Required: boolean;
    hidden: boolean;
    deprecated: boolean;
  } | null;
  currentVersion: StyleVariantVersion | null;
};

function mapCopySafetyTier(tier: CopySafetyTier): CopySafety {
  switch (tier) {
    case "balanced":
      return "balanced";
    case "experimental":
      return "preview_only";
    case "strict":
    default:
      return "strict";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mapDbPoolRowToVariantDefinition(
  row: DbPoolRow,
): { variant: VariantDefinition | null; issue?: RuntimeVariantPoolIssue } {
  const trace = evaluateUserSelectablePoolMembership({
    runtimeVariantId: row.runtimeVariantId,
    blockType: row.blockType,
    lifecycle: row.lifecycle,
    distribution: row.distribution
      ? {
          userSelectable: row.distribution.userSelectable,
          hidden: row.distribution.hidden,
          deprecated: row.distribution.deprecated,
        }
      : null,
    currentVersion: row.currentVersion
      ? { qualityStatus: row.currentVersion.qualityStatus }
      : null,
    definitionJson: row.currentVersion?.definitionJson,
  });

  if (!trace.eligible) {
    return {
      variant: null,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "ineligible_distribution",
        message:
          trace.exclusionReasons.join(", ") || "Variant excluded from user pool",
      },
    };
  }

  if (!row.currentVersion) {
    return {
      variant: null,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "missing_current_version",
        message: "Missing current version",
      },
    };
  }

  const definition = row.currentVersion.definitionJson;
  if (!isRecord(definition)) {
    return {
      variant: null,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "invalid_definition",
        message: "definitionJson is not an object",
      },
    };
  }

  const isDsl = isVariantDslV1(definition);
  const blockType = (isDsl
    ? definition.blockType
    : (definition.blockType ?? row.blockType)) as BlockType;

  const variant: VariantDefinition = {
    id: row.runtimeVariantId,
    schemaVersion: isDsl
      ? STYLE_SCHEMA_VERSION
      : ((definition.schemaVersion as VariantDefinition["schemaVersion"]) ??
        STYLE_SCHEMA_VERSION),
    blockType,
    family: String(
      isDsl ? (definition.family ?? row.styleFamily) : (definition.family ?? row.styleFamily),
    ),
    name: row.runtimeVariantId,
    label: row.label,
    description:
      typeof definition.description === "string" ? definition.description : row.description ?? undefined,
    status: (definition.status as VariantStatus) ?? "experimental",
    slots: isRecord(definition.slots)
      ? (definition.slots as VariantDefinition["slots"])
      : undefined,
    tokens: isRecord(definition.tokens)
      ? (definition.tokens as VariantDefinition["tokens"])
      : undefined,
    compatibility: isRecord(row.currentVersion.compatibilityJson)
      ? (row.currentVersion.compatibilityJson as VariantDefinition["compatibility"])
      : {
          copySafety: mapCopySafetyTier(row.currentVersion.copySafety),
        },
    componentProtocol: isRecord(row.currentVersion.componentProtocolJson)
      ? (row.currentVersion.componentProtocolJson as VariantDefinition["componentProtocol"])
      : undefined,
  };

  return { variant };
}
