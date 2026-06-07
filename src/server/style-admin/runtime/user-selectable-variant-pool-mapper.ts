import type { BlockType, CopySafetyTier, StyleVariant, StyleVariantVersion } from "@prisma/client";

import type { CopySafety, VariantDefinition, VariantStatus } from "@/core/styles/types";
import { STYLE_SCHEMA_VERSION } from "@/core/styles/types";

import { isEligibleForUserSelectablePool } from "../mappers";
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
  if (
    !row.distribution ||
    !isEligibleForUserSelectablePool({
      lifecycle: row.lifecycle,
      distribution: row.distribution,
    })
  ) {
    return {
      variant: null,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "ineligible_distribution",
        message: "Variant is not eligible for user-selectable pool",
      },
    };
  }

  if (row.lifecycle === "deprecated") {
    return {
      variant: null,
      issue: {
        runtimeVariantId: row.runtimeVariantId,
        code: "deprecated_lifecycle",
        message: "Deprecated lifecycle variants are excluded from user pool",
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

  const id = String(definition.id ?? row.runtimeVariantId);
  const blockType = (definition.blockType ?? row.blockType) as BlockType;

  const variant: VariantDefinition = {
    id,
    schemaVersion:
      (definition.schemaVersion as VariantDefinition["schemaVersion"]) ??
      STYLE_SCHEMA_VERSION,
    blockType,
    family: String(definition.family ?? row.styleFamily),
    name: String(definition.name ?? row.runtimeVariantId),
    label: String(definition.label ?? row.label),
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
