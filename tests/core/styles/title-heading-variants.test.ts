import { describe, expect, it } from "vitest";

import {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  HEADING_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_COMPONENT_ID,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  TITLE_FIRST_WAVE_VARIANTS,
  getVariantsForBlockType,
  parseStyleRegistry,
  validateStyleRegistry,
  validateTitleBlockLayoutCompatibility,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  validateVariantSlots,
  variantDefinitionSchema,
} from "@/core/styles";

const FORBIDDEN_LAYOUT_MODES = ["overlay", "offset_background"] as const;

describe("title / heading first-wave variants", () => {
  it("exports 3 title and 13 heading variants (16 total)", () => {
    expect(TITLE_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(HEADING_FIRST_WAVE_VARIANTS).toHaveLength(13);
    expect(TITLE_BLOCK_FIRST_WAVE_VARIANTS).toHaveLength(16);
  });

  it("has unique variant ids", () => {
    const ids = TITLE_BLOCK_FIRST_WAVE_VARIANTS.map((v) => v.id);
    expect(new Set(ids).size).toBe(16);
  });

  it("all variants are release1_required titleBlock definitions", () => {
    for (const variant of TITLE_BLOCK_FIRST_WAVE_VARIANTS) {
      expect(variant.status).toBe("release1_required");
      expect(variant.componentProtocol?.componentId).toBe(
        TITLE_BLOCK_COMPONENT_ID,
      );
      expect(variant.compatibility?.copySafety).not.toBe("preview_only");
      expect(
        FORBIDDEN_LAYOUT_MODES.includes(
          variant.componentProtocol!.layoutMode as (typeof FORBIDDEN_LAYOUT_MODES)[number],
        ),
      ).toBe(false);
    }
  });

  it("assigns correct blockType for title and heading groups", () => {
    for (const variant of TITLE_FIRST_WAVE_VARIANTS) {
      expect(variant.blockType).toBe("title");
    }
    for (const variant of HEADING_FIRST_WAVE_VARIANTS) {
      expect(variant.blockType).toBe("heading");
    }
  });

  it("requires title slot binding block.content.text with copy-safe slots", () => {
    for (const variant of TITLE_BLOCK_FIRST_WAVE_VARIANTS) {
      expect(variant.slots?.title).toBeDefined();
      expect(variant.slots!.title.binding.source).toBe("block.content.text");
      expect(variant.slots!.title.copySafety.copySafety).not.toBe(
        "preview_only",
      );
      expect(variant.slots!.title.copySafety.allowedInCopy).toBe(true);

      for (const slot of Object.values(variant.slots ?? {})) {
        if (slot.binding.source !== "disabled") {
          expect(slot.copySafety.allowedInCopy).toBe(true);
          expect(slot.copySafety.copySafety).not.toBe("preview_only");
        }
      }
    }
  });

  it("parses all variants through variantDefinitionSchema", () => {
    for (const variant of TITLE_BLOCK_FIRST_WAVE_VARIANTS) {
      expect(() => variantDefinitionSchema.parse(variant)).not.toThrow();
    }
  });

  it("passes full StyleValidationResult chain without errors", () => {
    for (const variant of TITLE_BLOCK_FIRST_WAVE_VARIANTS) {
      const parsed = variantDefinitionSchema.parse(variant);

      const slotsResult = validateVariantSlots(parsed);
      expect(slotsResult.ok, slotsResult.issues.map((i) => i.code).join(", ")).toBe(
        true,
      );
      expect(slotsResult.issues.filter((i) => i.severity === "error")).toHaveLength(
        0,
      );

      const layoutResult = validateTitleBlockLayoutCompatibility(parsed);
      expect(
        layoutResult.ok,
        layoutResult.issues.map((i) => i.code).join(", "),
      ).toBe(true);
      expect(
        layoutResult.issues.filter((i) => i.severity === "error"),
      ).toHaveLength(0);

      const wechatResult = validateVariantForWechatCopy(parsed);
      expect(
        wechatResult.ok,
        wechatResult.issues.map((i) => i.code).join(", "),
      ).toBe(true);
      expect(
        wechatResult.issues.filter((i) => i.severity === "error"),
      ).toHaveLength(0);

      const definitionResult = validateVariantDefinition(parsed);
      expect(
        definitionResult.ok,
        definitionResult.issues.map((i) => i.code).join(", "),
      ).toBe(true);
      expect(
        definitionResult.issues.filter((i) => i.severity === "error"),
      ).toHaveLength(0);
    }
  });

  it("supports registry lookup by blockType", () => {
    const registry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
    const titleVariants = getVariantsForBlockType(registry, "title");
    const headingVariants = getVariantsForBlockType(registry, "heading");

    expect(titleVariants).toHaveLength(3);
    expect(headingVariants).toHaveLength(13);
    expect(titleVariants.every((v) => v.status === "release1_required")).toBe(
      true,
    );
    expect(headingVariants.every((v) => v.status === "release1_required")).toBe(
      true,
    );
  });

  it("validates partial first-wave title/heading registry", () => {
    const registry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
    const result = validateStyleRegistry(registry);
    expect(result.ok, result.issues.map((i) => i.message).join("; ")).toBe(true);
  });

  it("lists expected variant ids", () => {
    expect(TITLE_BLOCK_FIRST_WAVE_VARIANTS.map((v) => v.id)).toEqual([
      "title_plain_minimal",
      "title_left_bar_classic",
      "title_bottom_line_editorial",
      "heading_plain_minimal",
      "heading_numbered_section",
      "heading_top_badge_topic",
      "heading_underline_classic",
      "heading_pill_topic",
      "heading_editorial_plain",
      "heading_keynote_strong",
      "heading_highlight_marker",
      "heading_short_line",
      "heading_icon_prefix",
      "heading_minimal_number",
      "heading_magazine_left_bar",
      "heading_magazine_offset",
    ]);
  });

  it("uses canonical layoutModes only", () => {
    expect(
      TITLE_FIRST_WAVE_VARIANTS.map((v) => v.componentProtocol?.layoutMode),
    ).toEqual(["plain", "left_bar", "bottom_line"]);
    expect(
      HEADING_FIRST_WAVE_VARIANTS.map((v) => v.componentProtocol?.layoutMode),
    ).toEqual([
      "plain",
      "numbered",
      "top_badge",
      "underline",
      "pill",
      "plain",
      "keynote_bar",
      "highlight_marker",
      "short_line",
      "icon_prefix",
      "minimal_number",
      "magazine_left_bar",
      "magazine_offset",
    ]);
  });
});
