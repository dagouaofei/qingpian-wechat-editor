import { describe, expect, it } from "vitest";

import {
  RELEASE1_VISUAL_ASSET_REGISTRY,
  STYLE_SCHEMA_VERSION,
  createFirstWaveRequiredVariantRegistry,
  validateAssetBindingsCompatibility,
  validateBlockStyleProtocolBundle,
  validateBlockVisualProtocol,
  validateComponentProtocol,
  validateSlotOverrideCompatibility,
  validateVariantProtocolCompatibility,
} from "@/core/styles";
import type { VariantDefinition } from "@/core/styles";

const registry = createFirstWaveRequiredVariantRegistry();
const assetRegistry = RELEASE1_VISUAL_ASSET_REGISTRY;

function getVariant(id: string): VariantDefinition {
  const variant = registry.variants.find((entry) => entry.id === id);
  if (!variant) {
    throw new Error(`missing variant ${id}`);
  }
  return variant;
}

describe("protocol validation", () => {
  it("accepts valid release1_required variant protocol", () => {
    const variant = getVariant("heading_plain_minimal");
    const result = validateVariantProtocolCompatibility(variant, {
      registry,
      assetRegistry,
      requireRelease1RequiredPath: true,
    });
    expect(result.ok).toBe(true);
  });

  it("errors when variant blockType does not match requested blockType", () => {
    const result = validateBlockVisualProtocol("title", "heading_plain_minimal", {
      registry,
      assetRegistry,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "block_visual_protocol_block_type_mismatch")).toBe(true);
  });

  it("errors for unregistered variantId", () => {
    const result = validateBlockVisualProtocol("title", "title_not_registered", {
      registry,
      assetRegistry,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "block_visual_protocol_variant_not_registered")).toBe(true);
  });

  it("errors for unregistered familyId in component protocol", () => {
    const result = validateComponentProtocol(
      {
        componentId: "titleBlock",
        familyId: "unknown_family",
        layoutMode: "plain",
      },
      {
        registry,
        assetRegistry,
        blockType: "heading",
      },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "component_protocol_family_not_registered")).toBe(true);
  });

  it("errors for illegal slot override key", () => {
    const variant = getVariant("heading_top_badge_topic");
    const result = validateSlotOverrideCompatibility(
      { badge: "STEP 1", unknown_slot: "x" },
      variant,
      { blockType: "heading" },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "slot_override_slot_not_allowed")).toBe(true);
  });

  it("errors when slot override targets body-content slot", () => {
    const variant = getVariant("title_plain_minimal");
    const result = validateSlotOverrideCompatibility(
      { title: "Injected title text" },
      variant,
      { blockType: "title" },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "slot_override_body_semantics_forbidden")).toBe(true);
  });

  it("errors when slot override contains html or style injection", () => {
    const variant = getVariant("heading_top_badge_topic");
    const htmlResult = validateSlotOverrideCompatibility(
      { badge: "<b>STEP</b>" },
      variant,
    );
    expect(htmlResult.issues.some((issue) => issue.code === "slot_override_contains_html")).toBe(true);

    const styleResult = validateSlotOverrideCompatibility(
      { badge: 'class="evil"' },
      variant,
    );
    expect(styleResult.issues.some((issue) => issue.code === "slot_override_contains_inline_style")).toBe(true);

    const forbiddenKeyResult = validateSlotOverrideCompatibility(
      { style: "color:red" },
      variant,
    );
    expect(forbiddenKeyResult.issues.some((issue) => issue.code === "slot_override_forbidden_property")).toBe(true);
  });

  it("errors when assetBindings reference unregistered assetId", () => {
    const variant = getVariant("heading_top_badge_topic");
    const result = validateAssetBindingsCompatibility(
      { badge: "icon-not-registered" },
      variant,
      {
        registry,
        assetRegistry,
        requireRelease1RequiredPath: true,
      },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "visual_asset_not_registered")).toBe(true);
  });

  it("errors when copy-unsafe asset used on required path", () => {
    const variant = getVariant("heading_top_badge_topic");
    const result = validateAssetBindingsCompatibility(
      { badge: "icon-warning-triangle" },
      variant,
      {
        registry,
        assetRegistry,
        requireRelease1RequiredPath: true,
      },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "visual_asset_not_copy_safe")).toBe(true);
  });

  it("errors when candidate variant enters default required path", () => {
    const candidateVariant: VariantDefinition = {
      ...getVariant("heading_plain_minimal"),
      id: "heading_candidate_only",
      status: "release1_candidate",
      compatibility: { copySafety: "balanced" },
    };
    const result = validateVariantProtocolCompatibility(candidateVariant, {
      registry,
      assetRegistry,
      requireRelease1RequiredPath: true,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "variant_status_not_required_path")).toBe(true);
  });

  it("validates titleBlock layout compatibility for heading variants", () => {
    const variant = getVariant("heading_top_badge_topic");
    const result = validateBlockStyleProtocolBundle({
      blockType: "heading",
      variantId: variant.id,
      context: {
        registry,
        assetRegistry,
        requireRelease1RequiredPath: true,
      },
    });
    expect(result.ok).toBe(true);
  });

  it("bundle validation rejects preview_only variant on required path", () => {
    const previewVariant: VariantDefinition = {
      ...getVariant("title_plain_minimal"),
      id: "title_preview_only",
      compatibility: { copySafety: "preview_only" },
    };
    const result = validateVariantProtocolCompatibility(previewVariant, {
      registry,
      assetRegistry,
      requireRelease1RequiredPath: true,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "variant_preview_only_on_required_path")).toBe(true);
  });

  it("accepts registered copy-safe asset bindings", () => {
    const variant = getVariant("heading_top_badge_topic");
    const result = validateAssetBindingsCompatibility(
      { badge: "mark-step-badge" },
      variant,
      {
        registry,
        assetRegistry,
        requireRelease1RequiredPath: true,
      },
    );
    expect(result.ok).toBe(true);
  });
});

describe("protocol validation schema guard", () => {
  it("rejects experimental status variant entering required path via bundle", () => {
    const experimental: VariantDefinition = {
      id: "heading_experimental",
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "heading",
      family: "simple",
      name: "experimental",
      label: "Experimental",
      status: "experimental",
      componentProtocol: {
        componentId: "titleBlock",
        familyId: "simple",
        layoutMode: "plain",
      },
    };
    const extendedRegistry = {
      ...registry,
      variants: [...registry.variants, experimental],
    };
    const result = validateBlockStyleProtocolBundle({
      blockType: "heading",
      variantId: experimental.id,
      context: {
        registry: extendedRegistry,
        assetRegistry,
        requireRelease1RequiredPath: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "variant_status_not_required_path")).toBe(true);
  });
});
