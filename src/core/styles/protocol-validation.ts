/**
 * ComponentProtocol / BlockVisualProtocol validation helpers
 * @see docs/architecture/style-system.md §11.1 / §11.8.3
 */

import type { BlockType } from "@/core/blocks";
import type { SlotOverrideValue } from "@/core/article";

import {
  buildBlockVisualProtocol,
  buildComponentProtocolForBlockType,
  isRegisteredFamilyInRegistry,
  TITLE_BLOCK_COMPONENT_PROTOCOL,
} from "./block-visual-protocol";
import { getVariantById } from "./registry";
import {
  validateTitleBlockLayoutCompatibility,
  isTitleBlockVariant,
} from "./title-layout";
import {
  BODY_CONTENT_SLOT_ROLES,
  TITLE_BLOCK_COMPONENT_ID,
} from "./types";
import type {
  StyleRegistry,
  StyleValidationIssue,
  StyleValidationResult,
  VariantComponentProtocol,
  VariantDefinition,
} from "./types";
import type { VisualAssetRegistry } from "./visual-assets";
import {
  getVisualAssetById,
  validateAssetBindingReferences,
} from "./visual-asset-registry";
import { buildStyleValidationResult } from "./validation";

const FORBIDDEN_SLOT_OVERRIDE_KEYS = new Set(["html", "css", "className", "style"]);
const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const INLINE_STYLE_INJECTION_PATTERN =
  /\b(style|class|className)\s*=|!important\b|url\s*\(/i;

export type ValidateProtocolContext = {
  registry: StyleRegistry;
  assetRegistry: VisualAssetRegistry;
  requireRelease1RequiredPath?: boolean;
  blockType?: BlockType;
  blockId?: string;
};

function pushIssues(
  target: StyleValidationIssue[],
  issues: StyleValidationIssue[],
): void {
  target.push(...issues);
}

function isNonRequiredVariantStatus(variant: VariantDefinition): boolean {
  return (
    variant.status === "release1_candidate" ||
    variant.status === "experimental"
  );
}

export function validateComponentProtocol(
  componentProtocol: VariantComponentProtocol | undefined,
  context: ValidateProtocolContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  if (!componentProtocol?.componentId) {
    return buildStyleValidationResult(issues);
  }

  const expectedComponentId =
    context.blockType === "title" || context.blockType === "heading"
      ? TITLE_BLOCK_COMPONENT_ID
      : context.blockType;

  if (
    expectedComponentId &&
    componentProtocol.componentId !== expectedComponentId &&
    componentProtocol.componentId !== TITLE_BLOCK_COMPONENT_ID
  ) {
    issues.push({
      severity: "error",
      code: "component_protocol_component_mismatch",
      message: `ComponentProtocol componentId "${componentProtocol.componentId}" does not match block component "${expectedComponentId}"`,
      blockType: context.blockType,
      blockId: context.blockId,
      path: ["componentProtocol", "componentId"],
      value: componentProtocol.componentId,
    });
  }

  if (componentProtocol.componentId === TITLE_BLOCK_COMPONENT_ID) {
    const protocol = TITLE_BLOCK_COMPONENT_PROTOCOL;

    if (
      componentProtocol.familyId &&
      !protocol.allowedFamilies.includes(componentProtocol.familyId)
    ) {
      issues.push({
        severity: "error",
        code: "component_protocol_family_not_allowed",
        message: `ComponentProtocol familyId "${componentProtocol.familyId}" is not allowed for titleBlock`,
        blockType: context.blockType,
        blockId: context.blockId,
        path: ["componentProtocol", "familyId"],
        value: componentProtocol.familyId,
      });
    }

    if (
      componentProtocol.familyId &&
      !isRegisteredFamilyInRegistry(context.registry, componentProtocol.familyId)
    ) {
      issues.push({
        severity: "error",
        code: "component_protocol_family_not_registered",
        message: `ComponentProtocol familyId "${componentProtocol.familyId}" is not registered in StyleRegistry`,
        blockType: context.blockType,
        blockId: context.blockId,
        path: ["componentProtocol", "familyId"],
        value: componentProtocol.familyId,
      });
    }

    if (
      componentProtocol.layoutMode &&
      !protocol.allowedLayoutModes.includes(componentProtocol.layoutMode)
    ) {
      issues.push({
        severity: "error",
        code: "component_protocol_layout_not_allowed",
        message: `ComponentProtocol layoutMode "${componentProtocol.layoutMode}" is not allowed for titleBlock`,
        blockType: context.blockType,
        blockId: context.blockId,
        path: ["componentProtocol", "layoutMode"],
        value: componentProtocol.layoutMode,
      });
    }
  } else if (componentProtocol.familyId) {
    const blockProtocol = context.blockType
      ? buildComponentProtocolForBlockType(context.blockType)
      : undefined;

    if (
      blockProtocol &&
      blockProtocol.allowedFamilies.length > 0 &&
      !blockProtocol.allowedFamilies.includes(componentProtocol.familyId)
    ) {
      issues.push({
        severity: "error",
        code: "component_protocol_family_not_allowed",
        message: `ComponentProtocol familyId "${componentProtocol.familyId}" is not allowed for component "${componentProtocol.componentId}"`,
        blockType: context.blockType,
        blockId: context.blockId,
        path: ["componentProtocol", "familyId"],
        value: componentProtocol.familyId,
      });
    }

    if (!isRegisteredFamilyInRegistry(context.registry, componentProtocol.familyId)) {
      issues.push({
        severity: "error",
        code: "component_protocol_family_not_registered",
        message: `ComponentProtocol familyId "${componentProtocol.familyId}" is not registered in StyleRegistry`,
        blockType: context.blockType,
        blockId: context.blockId,
        path: ["componentProtocol", "familyId"],
        value: componentProtocol.familyId,
      });
    }
  }

  return buildStyleValidationResult(issues);
}

export function validateBlockVisualProtocol(
  blockType: BlockType,
  variantId: string,
  context: ValidateProtocolContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const protocol = buildBlockVisualProtocol(context.registry, blockType);
  const variant = getVariantById(context.registry, variantId);

  if (!variant) {
    issues.push({
      severity: "error",
      code: "block_visual_protocol_variant_not_registered",
      message: `Variant "${variantId}" is not registered in StyleRegistry`,
      blockType,
      blockId: context.blockId,
      variantId,
      path: ["variantId"],
      value: variantId,
    });
    return buildStyleValidationResult(issues);
  }

  if (variant.blockType !== blockType) {
    issues.push({
      severity: "error",
      code: "block_visual_protocol_block_type_mismatch",
      message: `Variant "${variantId}" blockType "${variant.blockType}" does not match "${blockType}"`,
      blockType,
      blockId: context.blockId,
      variantId,
      path: ["variantId"],
      value: variantId,
    });
  }

  if (!protocol.allowedVariants.includes(variantId)) {
    issues.push({
      severity: "error",
      code: "block_visual_protocol_variant_not_allowed",
      message: `Variant "${variantId}" is not allowed for blockType "${blockType}"`,
      blockType,
      blockId: context.blockId,
      variantId,
      path: ["variantId"],
      value: variantId,
    });
  }

  if (!protocol.allowedFamilies.includes(variant.family)) {
    issues.push({
      severity: "error",
      code: "block_visual_protocol_family_not_allowed",
      message: `Variant family "${variant.family}" is not allowed for blockType "${blockType}"`,
      blockType,
      blockId: context.blockId,
      variantId,
      path: ["family"],
      value: variant.family,
    });
  }

  return buildStyleValidationResult(issues);
}

export function validateVariantProtocolCompatibility(
  variant: VariantDefinition,
  context: ValidateProtocolContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  if (context.requireRelease1RequiredPath) {
    if (variant.status !== "release1_required") {
      issues.push({
        severity: "error",
        code: "variant_status_not_required_path",
        message: `Variant "${variant.id}" status "${variant.status}" is not allowed on default release1_required path`,
        blockType: variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path: ["status"],
        value: variant.status,
      });
    }

    if (variant.compatibility?.copySafety === "preview_only") {
      issues.push({
        severity: "error",
        code: "variant_preview_only_on_required_path",
        message: `Variant "${variant.id}" uses preview_only copySafety and cannot enter default release1_required path`,
        blockType: variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path: ["compatibility", "copySafety"],
        value: "preview_only",
      });
    }
  } else if (isNonRequiredVariantStatus(variant)) {
    issues.push({
      severity: "warning",
      code: "variant_non_required_status",
      message: `Variant "${variant.id}" status "${variant.status}" is candidate or experimental`,
      blockType: variant.blockType,
      blockId: context.blockId,
      variantId: variant.id,
      path: ["status"],
      value: variant.status,
    });
  }

  const componentResult = validateComponentProtocol(variant.componentProtocol, {
    ...context,
    blockType: variant.blockType,
  });
  pushIssues(issues, componentResult.issues);

  const blockVisualResult = validateBlockVisualProtocol(
    variant.blockType,
    variant.id,
    { ...context, blockType: variant.blockType },
  );
  pushIssues(issues, blockVisualResult.issues);

  if (isTitleBlockVariant(variant)) {
    const layoutResult = validateTitleBlockLayoutCompatibility(variant, {
      copySafety: variant.compatibility?.copySafety,
    });
    pushIssues(issues, layoutResult.issues);
  }

  return buildStyleValidationResult(issues);
}

function validateSlotOverrideValue(
  slotKey: string,
  value: SlotOverrideValue,
  path: Array<string | number>,
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];

  if (typeof value !== "string") {
    return issues;
  }

  if (HTML_PATTERN.test(value)) {
    issues.push({
      severity: "error",
      code: "slot_override_contains_html",
      message: `Slot override "${slotKey}" must not contain HTML`,
      path,
      property: slotKey,
    });
  }

  if (INLINE_STYLE_INJECTION_PATTERN.test(value)) {
    issues.push({
      severity: "error",
      code: "slot_override_contains_inline_style",
      message: `Slot override "${slotKey}" must not contain inline style or class attributes`,
      path,
      property: slotKey,
    });
  }

  return issues;
}

export function validateSlotOverrideCompatibility(
  slotOverrides: Record<string, SlotOverrideValue> | undefined,
  variant: VariantDefinition,
  context: Pick<ValidateProtocolContext, "blockId" | "blockType"> = {},
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  if (!slotOverrides || Object.keys(slotOverrides).length === 0) {
    return buildStyleValidationResult(issues);
  }

  const allowedSlotKeys = new Set(Object.keys(variant.slots ?? {}));

  for (const [slotKey, value] of Object.entries(slotOverrides)) {
    const path = ["slotOverrides", slotKey];

    if (FORBIDDEN_SLOT_OVERRIDE_KEYS.has(slotKey)) {
      issues.push({
        severity: "error",
        code: "slot_override_forbidden_property",
        message: `Slot override key "${slotKey}" is forbidden; must not use html / css / className / style`,
        blockType: context.blockType ?? variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path,
        property: slotKey,
      });
      continue;
    }

    if (!allowedSlotKeys.has(slotKey)) {
      issues.push({
        severity: "error",
        code: "slot_override_slot_not_allowed",
        message: `Slot override "${slotKey}" is not allowed on variant "${variant.id}"`,
        blockType: context.blockType ?? variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path,
        property: slotKey,
      });
      continue;
    }

    const slot = variant.slots?.[slotKey];
    if (
      slot &&
      (BODY_CONTENT_SLOT_ROLES as readonly string[]).includes(slot.role)
    ) {
      issues.push({
        severity: "error",
        code: "slot_override_body_semantics_forbidden",
        message: `Slot override must not target body-content slot "${slotKey}" (${slot.role})`,
        blockType: context.blockType ?? variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path,
        property: slotKey,
      });
    }

    pushIssues(
      issues,
      validateSlotOverrideValue(slotKey, value, path),
    );
  }

  return buildStyleValidationResult(issues);
}

export function validateAssetBindingsCompatibility(
  assetBindings: Record<string, string> | undefined,
  variant: VariantDefinition,
  context: ValidateProtocolContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  if (!assetBindings || Object.keys(assetBindings).length === 0) {
    return buildStyleValidationResult(issues);
  }

  const allowedSlotKeys = new Set(Object.keys(variant.slots ?? {}));

  for (const slotKey of Object.keys(assetBindings)) {
    if (!allowedSlotKeys.has(slotKey)) {
      issues.push({
        severity: "error",
        code: "asset_binding_slot_not_allowed",
        message: `Asset binding slot "${slotKey}" is not allowed on variant "${variant.id}"`,
        blockType: variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path: ["assetBindings", slotKey],
        property: slotKey,
      });
    }
  }

  pushIssues(
    issues,
    validateAssetBindingReferences(assetBindings, context.assetRegistry, {
      requireCopySafe: context.requireRelease1RequiredPath,
      variantId: variant.id,
      blockType: variant.blockType,
    }),
  );

  for (const [slotKey, assetId] of Object.entries(assetBindings)) {
    const asset = getVisualAssetById(context.assetRegistry, assetId);
    if (!asset) {
      continue;
    }

    const slot = variant.slots?.[slotKey];
    if (
      slot &&
      (slot.role === "icon" ||
        slot.role === "decoration" ||
        slot.role === "badge") &&
      slot.binding.source !== "assetRegistry" &&
      slot.binding.source !== "variant.presentation" &&
      slot.binding.source !== "disabled"
    ) {
      issues.push({
        severity: "warning",
        code: "asset_binding_slot_source_mismatch",
        message: `Asset binding on slot "${slotKey}" may not match slot binding source "${slot.binding.source}"`,
        blockType: variant.blockType,
        blockId: context.blockId,
        variantId: variant.id,
        path: ["assetBindings", slotKey],
        property: slotKey,
        value: assetId,
      });
    }
  }

  return buildStyleValidationResult(issues);
}

export function validateBlockStyleProtocolBundle(input: {
  blockType: BlockType;
  blockId?: string;
  variantId: string;
  familyId?: string;
  slotOverrides?: Record<string, SlotOverrideValue>;
  assetBindings?: Record<string, string>;
  context: ValidateProtocolContext;
}): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const variant = getVariantById(input.context.registry, input.variantId);

  if (!variant) {
    issues.push({
      severity: "error",
      code: "variant_not_registered",
      message: `Variant "${input.variantId}" is not registered in StyleRegistry`,
      blockType: input.blockType,
      blockId: input.blockId,
      variantId: input.variantId,
      path: ["variantId"],
      value: input.variantId,
    });
    return buildStyleValidationResult(issues);
  }

  if (input.familyId && input.familyId !== variant.family) {
    issues.push({
      severity: "error",
      code: "family_id_variant_mismatch",
      message: `familyId "${input.familyId}" does not match variant "${variant.id}" family "${variant.family}"`,
      blockType: input.blockType,
      blockId: input.blockId,
      variantId: variant.id,
      path: ["familyId"],
      value: input.familyId,
    });
  }

  if (input.familyId && !isRegisteredFamilyInRegistry(input.context.registry, input.familyId)) {
    issues.push({
      severity: "error",
      code: "family_id_not_registered",
      message: `familyId "${input.familyId}" is not registered in StyleRegistry`,
      blockType: input.blockType,
      blockId: input.blockId,
      path: ["familyId"],
      value: input.familyId,
    });
  }

  const bundleContext: ValidateProtocolContext = {
    ...input.context,
    blockType: input.blockType,
    blockId: input.blockId,
  };

  pushIssues(
    issues,
    validateVariantProtocolCompatibility(variant, bundleContext).issues,
  );
  pushIssues(
    issues,
    validateSlotOverrideCompatibility(input.slotOverrides, variant, {
      blockId: input.blockId,
      blockType: input.blockType,
    }).issues,
  );
  pushIssues(
    issues,
    validateAssetBindingsCompatibility(input.assetBindings, variant, bundleContext)
      .issues,
  );

  return buildStyleValidationResult(issues);
}
