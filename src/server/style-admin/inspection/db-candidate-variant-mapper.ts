import type { BlockType, CopySafetyTier } from "@prisma/client";

import type { CopySafety, VariantDefinition, VariantStatus } from "@/core/styles/types";
import { STYLE_SCHEMA_VERSION } from "@/core/styles/types";

import type { DbCandidateInspectionSource } from "./candidate-inspection-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

export function mapDbCandidateToVariantDefinition(
  source: DbCandidateInspectionSource,
): VariantDefinition | null {
  const rawDefinition = source.definitionJson;
  if (!isRecord(rawDefinition)) {
    return null;
  }
  const definition = rawDefinition as Record<string, unknown>;

  const blockType = (definition.blockType ?? source.blockType) as BlockType;

  return {
    id: String(definition.id ?? source.runtimeVariantId),
    schemaVersion:
      (definition.schemaVersion as VariantDefinition["schemaVersion"]) ??
      STYLE_SCHEMA_VERSION,
    blockType,
    family: String(definition.family ?? source.styleFamily),
    name: String(definition.name ?? source.runtimeVariantId),
    label: String(definition.label ?? source.label),
    description:
      typeof definition.description === "string" ? definition.description : undefined,
    status: (definition.status as VariantStatus) ?? "experimental",
    slots: isRecord(definition.slots)
      ? (definition.slots as VariantDefinition["slots"])
      : undefined,
    tokens: isRecord(definition.tokens)
      ? (definition.tokens as VariantDefinition["tokens"])
      : undefined,
    compatibility: isRecord(source.compatibilityJson)
      ? (source.compatibilityJson as VariantDefinition["compatibility"])
      : {
          copySafety: mapCopySafetyTier(source.copySafety),
        },
    componentProtocol: isRecord(source.componentProtocolJson)
      ? (source.componentProtocolJson as VariantDefinition["componentProtocol"])
      : undefined,
  };
}

export function shouldUseAdminInspectionFallback(
  runtimeVariantId: string,
  styleFamily: string,
): boolean {
  if (runtimeVariantId.includes("_html_paste_") && runtimeVariantId.endsWith("_candidate")) {
    return true;
  }
  return styleFamily === "htmlPaste" || styleFamily === "htmlPasteCandidate";
}
