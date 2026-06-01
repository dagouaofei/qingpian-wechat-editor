import { describe, expect, it } from "vitest";

import {
  FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK,
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  FIRST_WAVE_REQUIRED_VARIANTS,
  STYLE_SCHEMA_VERSION,
  TITLE_BLOCK_COMPONENT_ID,
  createFirstWaveRequiredVariantRegistry,
  getVariantById,
  getVariantsForBlockType,
  titleBlockLayoutModeSchema,
  validateStyleRegistry,
  validateTitleBlockLayoutCompatibility,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  validateVariantSlots,
  variantDefinitionSchema,
} from "@/core/styles";
import type { BlockType } from "@/core/blocks";
import type { VariantDefinition } from "@/core/styles";

const RELEASE1_BLOCK_TYPES = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "divider",
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "image_placeholder",
] as const satisfies readonly BlockType[];

const FORBIDDEN_TITLE_LAYOUT_MODES = [
  "magazine_left_bar",
  "overlay",
  "offset_background",
] as const;

function expectNoUnsafeKeys(value: unknown): void {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    expect(["html", "css", "className", "style", "component"]).not.toContain(
      key,
    );
    expectNoUnsafeKeys(nestedValue);
  }
}

function expectVariantValidationOk(variant: VariantDefinition): void {
  const parsed = variantDefinitionSchema.parse(variant);

  const slotResult = validateVariantSlots(parsed);
  expect(slotResult.ok, slotResult.issues.map((i) => i.code).join(", ")).toBe(
    true,
  );
  expect(slotResult.issues).toHaveLength(0);

  const wechatResult = validateVariantForWechatCopy(parsed);
  expect(
    wechatResult.ok,
    wechatResult.issues.map((i) => i.code).join(", "),
  ).toBe(true);
  expect(wechatResult.issues).toHaveLength(0);

  const definitionResult = validateVariantDefinition(parsed);
  expect(
    definitionResult.ok,
    definitionResult.issues.map((i) => i.code).join(", "),
  ).toBe(true);
  expect(definitionResult.issues).toHaveLength(0);
}

describe("first-wave required variant coverage", () => {
  it("covers exactly 33 release1_required variants", () => {
    expect(FIRST_WAVE_REQUIRED_VARIANTS).toHaveLength(33);
    expect(FIRST_WAVE_REQUIRED_VARIANT_IDS).toHaveLength(33);
    expect(new Set(FIRST_WAVE_REQUIRED_VARIANT_IDS).size).toBe(33);

    for (const variant of FIRST_WAVE_REQUIRED_VARIANTS) {
      expect(variant.schemaVersion).toBe(STYLE_SCHEMA_VERSION);
      expect(variant.status).toBe("release1_required");
      expect(variant.status).not.toBe("release1_candidate");
      expect(variant.status).not.toBe("experimental");
    }
  });

  it("covers the 11 Release 1 block types with exactly 3 variants each", () => {
    const actualBlockTypes = new Set(
      FIRST_WAVE_REQUIRED_VARIANTS.map((variant) => variant.blockType),
    );
    expect(actualBlockTypes).toEqual(new Set(RELEASE1_BLOCK_TYPES));

    for (const blockType of RELEASE1_BLOCK_TYPES) {
      expect(FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK[blockType]).toBe(3);
      expect(
        FIRST_WAVE_REQUIRED_VARIANTS.filter(
          (variant) => variant.blockType === blockType,
        ),
      ).toHaveLength(3);
    }
  });

  it("contains no forbidden model fields, forbidden CSS declarations, or preview_only copy path", () => {
    for (const variant of FIRST_WAVE_REQUIRED_VARIANTS) {
      expectNoUnsafeKeys(variant);
      expect(variant.compatibility?.copySafety).not.toBe("preview_only");
      expect(variant.compatibility?.wechat?.forbiddenCssProperties ?? []).toHaveLength(
        0,
      );

      for (const slot of Object.values(variant.slots ?? {})) {
        expect(slot.copySafety.copySafety).not.toBe("preview_only");
        if (slot.binding.source !== "disabled") {
          expect(slot.copySafety.allowedInCopy).toBe(true);
        }
      }
    }
  });

  it("validates titleBlock layout compatibility for title and heading", () => {
    const titleBlockVariants = FIRST_WAVE_REQUIRED_VARIANTS.filter(
      (variant) => variant.blockType === "title" || variant.blockType === "heading",
    );
    expect(titleBlockVariants).toHaveLength(6);

    for (const variant of titleBlockVariants) {
      expect(variant.componentProtocol?.componentId).toBe(
        TITLE_BLOCK_COMPONENT_ID,
      );
      expect(
        titleBlockLayoutModeSchema.safeParse(
          variant.componentProtocol?.layoutMode,
        ).success,
      ).toBe(true);
      expect(
        FORBIDDEN_TITLE_LAYOUT_MODES.includes(
          variant.componentProtocol!
            .layoutMode as (typeof FORBIDDEN_TITLE_LAYOUT_MODES)[number],
        ),
      ).toBe(false);

      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok, result.issues.map((i) => i.code).join(", ")).toBe(true);
      expect(result.issues).toHaveLength(0);
    }
  });

  it("does not declare forbidden titleBlock layoutMode on non-titleBlock variants", () => {
    const nonTitleBlockVariants = FIRST_WAVE_REQUIRED_VARIANTS.filter(
      (variant) => variant.blockType !== "title" && variant.blockType !== "heading",
    );

    for (const variant of nonTitleBlockVariants) {
      expect(variant.componentProtocol?.layoutMode).toBeUndefined();
    }
  });

  it("validates slot binding and slot copySafety for all variants", () => {
    for (const variant of FIRST_WAVE_REQUIRED_VARIANTS) {
      expect(variant.slots).toBeDefined();
      for (const slot of Object.values(variant.slots ?? {})) {
        expect(() => variantDefinitionSchema.parse(variant)).not.toThrow();

        if (slot.binding.required) {
          expect(slot.binding.source).not.toBe("disabled");
        }
        if (["title", "body", "items"].includes(slot.role)) {
          expect(slot.binding.source).not.toBe("variant.presentation");
          expect(slot.binding.source).not.toBe("assetRegistry");
        }
        if (slot.binding.source === "disabled") {
          expect(slot.copySafety.allowedInCopy).toBe(false);
        }
        if (slot.copySafety.fallbackSlotId) {
          expect(slot.copySafety.fallbackSlotId).not.toBe(slot.id);
          expect(variant.slots?.[slot.copySafety.fallbackSlotId]).toBeDefined();
        }
      }

      const result = validateVariantSlots(variant);
      expect(result.ok, result.issues.map((i) => i.code).join(", ")).toBe(true);
      expect(result.issues).toHaveLength(0);
    }
  });

  it("passes schema, variant validation, and WeChat compatibility for every variant", () => {
    for (const variant of FIRST_WAVE_REQUIRED_VARIANTS) {
      expect(() => variantDefinitionSchema.parse(variant)).not.toThrow();
      expectVariantValidationOk(variant);
    }
  });

  it("builds and validates a complete first-wave StyleRegistry", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    expect(registry.variants).toHaveLength(33);

    const result = validateStyleRegistry(registry);
    expect(result.ok, result.issues.map((i) => i.message).join("; ")).toBe(
      true,
    );
    expect(result.issues).toHaveLength(0);
  });

  it("supports stable registry helper lookups by blockType and id", () => {
    const registry = createFirstWaveRequiredVariantRegistry();

    expect(getVariantsForBlockType(registry, "title")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "paragraph")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "image_placeholder")).toHaveLength(
      3,
    );

    for (const variantId of FIRST_WAVE_REQUIRED_VARIANT_IDS) {
      expect(getVariantById(registry, variantId)?.id).toBe(variantId);
    }
    expect(getVariantById(registry, "missing_variant")).toBeUndefined();
  });
});
