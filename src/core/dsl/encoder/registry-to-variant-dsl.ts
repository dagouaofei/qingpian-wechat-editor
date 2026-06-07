import type { BlockType } from "@/core/blocks";
import type { VariantDefinition } from "@/core/styles/types";

import {
  VARIANT_DSL_VERSION,
  getDefaultRenderContract,
  type DslSlotBinding,
  type VariantDslV1,
} from "../runtime";
import type { EncoderIssue, EncoderResult } from "./encoder-types";

function mapSlots(slots: VariantDefinition["slots"]): Record<string, DslSlotBinding> | undefined {
  if (!slots) return undefined;
  const mapped: Record<string, DslSlotBinding> = {};
  for (const [key, slot] of Object.entries(slots)) {
    mapped[key] = {
      role: slot.role,
      required: slot.binding?.required,
    };
  }
  return mapped;
}

function mapCopySafety(copySafety: VariantDefinition["compatibility"]): VariantDslV1["copySafety"] {
  return copySafety?.copySafety ?? "strict";
}

export function encodeRegistryVariantToDsl(variant: VariantDefinition): EncoderResult<VariantDslV1> {
  const issues: EncoderIssue[] = [];

  if (!variant.id || !variant.blockType) {
    return {
      ok: false,
      issues: [{ code: "invalid_variant", message: "Registry variant missing id or blockType" }],
    };
  }

  const renderContract = getDefaultRenderContract(variant.blockType as BlockType);

  const dsl: VariantDslV1 = {
    version: VARIANT_DSL_VERSION,
    id: variant.id,
    blockType: variant.blockType,
    label: variant.label,
    family: variant.family,
    copySafety: mapCopySafety(variant.compatibility),
    renderContract,
    tokens: variant.tokens ? { ...variant.tokens } : undefined,
    slots: mapSlots(variant.slots),
    componentProtocol: variant.componentProtocol
      ? (variant.componentProtocol as Record<string, unknown>)
      : undefined,
    compatibility: variant.compatibility
      ? (variant.compatibility as Record<string, unknown>)
      : undefined,
    meta: {
      source: "registry_encoder",
      schemaVersion: variant.schemaVersion,
      status: variant.status,
      encoderVersion: "s10_registry_encoder_v1",
      legacySlots: variant.slots,
    },
  };

  if (!variant.componentProtocol && (variant.blockType === "title" || variant.blockType === "heading")) {
    issues.push({
      code: "missing_component_protocol",
      message: `Variant ${variant.id} missing componentProtocol`,
    });
  }

  return { ok: true, value: dsl, issues };
}

export function encodeLegacyDefinitionToVariantDsl(
  definition: Record<string, unknown>,
  runtimeVariantId: string,
  blockType: BlockType,
): EncoderResult<VariantDslV1> {
  if (definition.version === VARIANT_DSL_VERSION) {
    return { ok: true, value: definition as VariantDslV1, issues: [] };
  }

  const variant: VariantDefinition = {
    id: String(definition.id ?? runtimeVariantId),
    schemaVersion: (definition.schemaVersion as VariantDefinition["schemaVersion"]) ?? "1.0",
    blockType,
    family: String(definition.family ?? "unknown"),
    name: String(definition.name ?? runtimeVariantId),
    label: String(definition.label ?? runtimeVariantId),
    description: typeof definition.description === "string" ? definition.description : undefined,
    status: (definition.status as VariantDefinition["status"]) ?? "experimental",
    slots: definition.slots as VariantDefinition["slots"],
    tokens: definition.tokens as VariantDefinition["tokens"],
    componentProtocol: definition.componentProtocol as VariantDefinition["componentProtocol"],
    compatibility: definition.compatibility as VariantDefinition["compatibility"],
  };

  return encodeRegistryVariantToDsl(variant);
}
