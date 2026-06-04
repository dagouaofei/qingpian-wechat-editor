import { describe, expect, it } from "vitest";

import {
  RELEASE1_VISUAL_ASSET_REGISTRY,
  STYLE_SCHEMA_VERSION,
  createFirstWaveRequiredVariantRegistry,
  validateDensityValue,
  validatePresetDefinition,
  validatePresetThemeCombination,
  validateStyleAssignmentBlockOverride,
  validateThemePresetDensitySlotCombination,
} from "@/core/styles";

const registry = createFirstWaveRequiredVariantRegistry();

describe("style combination validation", () => {
  it("errors for unknown density", () => {
    const issues = validateDensityValue("dense");
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe("unknown_density");
  });

  it("errors when preset references unknown variantId", () => {
    const brokenPreset = {
      id: "broken-preset",
      name: "Broken",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        title: "title_does_not_exist",
      },
    };
    const result = validatePresetDefinition(brokenPreset, { registry });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "preset_variant_not_registered")).toBe(true);
  });

  it("errors when preset references unknown theme", () => {
    const result = validatePresetThemeCombination(
      { presetId: "business", themeId: "missing-theme" },
      { registry },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "theme_not_registered")).toBe(true);
  });

  it("validates block override density and protocol boundaries together", () => {
    const result = validateThemePresetDensitySlotCombination({
      presetId: "business",
      themeId: "businessBlue",
      density: "standard",
      blockOverrides: [
        {
          blockType: "heading",
          override: {
            blockId: "h1",
            variantId: "heading_card_centered",
            slotOverrides: { badge: "01" },
            assetBindings: { badge: "mark-step-badge" },
          },
        },
      ],
      context: {
        registry,
        assetRegistry: RELEASE1_VISUAL_ASSET_REGISTRY,
      },
    });
    expect(result.ok).toBe(true);
  });

  it("errors when block override uses unknown density", () => {
    const result = validateStyleAssignmentBlockOverride(
      {
        blockId: "h1",
        variantId: "heading_short_line",
        density: "dense" as never,
      },
      "heading",
      { registry },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "unknown_density")).toBe(true);
  });

  it("errors when block override familyId is not registered", () => {
    const result = validateStyleAssignmentBlockOverride(
      {
        blockId: "h1",
        variantId: "heading_short_line",
        familyId: "not_a_family",
      },
      "heading",
      { registry },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "family_id_not_registered")).toBe(true);
  });

  it("errors when preset default variant is not release1_required on required path", () => {
    const candidateRegistry = {
      ...registry,
      presets: [
        {
          id: "candidate-preset",
          name: "Candidate Preset",
          schemaVersion: STYLE_SCHEMA_VERSION,
          themeId: "businessBlue",
          defaultVariantByBlockType: {
            heading: "heading_candidate_only",
          },
        },
      ],
      variants: [
        ...registry.variants,
        {
          ...registry.variants.find((variant) => variant.id === "heading_short_line")!,
          id: "heading_candidate_only",
          status: "release1_candidate" as const,
        },
      ],
    };

    const result = validatePresetDefinition(
      candidateRegistry.presets[0]!,
      {
        registry: candidateRegistry,
        requireRelease1RequiredPath: true,
      },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "preset_variant_not_required_path")).toBe(true);
  });

  it("errors when block override slot override is illegal", () => {
    const result = validateStyleAssignmentBlockOverride(
      {
        blockId: "t1",
        variantId: "title_plain_minimal",
        slotOverrides: { title: "override body title" },
      },
      "title",
      { registry },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "slot_override_body_semantics_forbidden")).toBe(true);
  });

  it("errors when block override assetBindings use unregistered asset", () => {
    const result = validateStyleAssignmentBlockOverride(
      {
        blockId: "h1",
        variantId: "heading_card_centered",
        assetBindings: { badge: "asset-missing" },
      },
      "heading",
      {
        registry,
        assetRegistry: RELEASE1_VISUAL_ASSET_REGISTRY,
      },
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "visual_asset_not_registered")).toBe(true);
  });
});
