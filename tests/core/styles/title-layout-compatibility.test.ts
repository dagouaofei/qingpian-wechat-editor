import { describe, expect, it } from "vitest";

import {
  STYLE_SCHEMA_VERSION,
  TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE,
  TITLE_BLOCK_LAYOUT_MODES,
  assertTitleBlockLayoutTableComplete,
  getFallbackTitleBlockLayoutMode,
  getTitleBlockLayoutCompatibility,
  isTitleBlockLayoutAllowedForCopy,
  isTitleBlockVariant,
  mapTitleBlockCatalogLayoutMode,
  normalizeTitleBlockLayoutMode,
  titleBlockLayoutCompatibilityTableSchema,
  titleBlockLayoutModeSchema,
  validateTitleBlockLayoutCompatibility,
  validateVariantDefinition,
  variantDefinitionSchema,
} from "@/core/styles";

const baseTitleVariant = {
  id: "title-centered",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "title" as const,
  family: "simple",
  name: "title-centered",
  label: "居中标题",
  status: "release1_required" as const,
  componentProtocol: {
    componentId: "titleBlock",
    familyId: "simple",
    layoutMode: "plain" as const,
  },
};

describe("title block layout compatibility", () => {
  describe("TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE", () => {
    it("default table schema is valid", () => {
      expect(
        titleBlockLayoutCompatibilityTableSchema.parse(
          TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE,
        ),
      ).toBeDefined();
    });

    it("covers all layoutMode values", () => {
      expect(assertTitleBlockLayoutTableComplete()).toBe(true);
      expect(Object.keys(TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE)).toHaveLength(
        TITLE_BLOCK_LAYOUT_MODES.length,
      );
    });

    it("allows plain / left_bar / bottom_line in copy", () => {
      for (const mode of ["plain", "left_bar", "bottom_line"] as const) {
        expect(isTitleBlockLayoutAllowedForCopy(mode)).toBe(true);
        expect(getTitleBlockLayoutCompatibility(mode)?.allowedInCopy).toBe(
          true,
        );
      }
    });
  });

  describe("getFallbackTitleBlockLayoutMode", () => {
    it("returns safer fallback for overlay", () => {
      expect(getFallbackTitleBlockLayoutMode("overlay")).toBe("plain");
    });

    it("returns left_bar fallback for magazine_left_bar", () => {
      expect(getFallbackTitleBlockLayoutMode("magazine_left_bar")).toBe(
        "left_bar",
      );
    });

    it("returns undefined when fallback points to self", () => {
      const broken = {
        ...TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE.plain,
        fallbackLayoutMode: "plain" as const,
      };
      expect(broken.fallbackLayoutMode).toBe("plain");
      expect(getFallbackTitleBlockLayoutMode("plain")).toBeUndefined();
    });
  });

  describe("validateTitleBlockLayoutCompatibility", () => {
    it("passes for release1_required plain titleBlock variant", () => {
      const variant = variantDefinitionSchema.parse(baseTitleVariant);
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(true);
    });

    it("errors for release1_required overlay", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "overlay",
        },
      });
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some(
          (i) => i.code === "title_layout_forbidden_for_required",
        ),
      ).toBe(true);
    });

    it("errors for release1_required offset_background", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "offset_background",
        },
      });
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(false);
    });

    it("errors for release1_required magazine_left_bar", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "magazine_left_bar",
        },
      });
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(false);
    });

    it("warns for release1_candidate magazine_left_bar", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        id: "magazine-title",
        status: "release1_candidate",
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "magazine_left_bar",
        },
      });
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(true);
      expect(
        result.issues.some((i) => i.code === "title_layout_candidate_only"),
      ).toBe(true);
    });

    it("errors when allowedInCopy=false without safer fallback path in validation", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        status: "experimental",
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "overlay",
        },
      });
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some((i) => i.code === "title_layout_not_allowed_in_copy"),
      ).toBe(true);
    });

    it("does not require layoutMode for non-titleBlock paragraph variant", () => {
      const variant = variantDefinitionSchema.parse({
        id: "paragraph-standard",
        schemaVersion: STYLE_SCHEMA_VERSION,
        blockType: "paragraph",
        family: "simple",
        name: "paragraph-standard",
        label: "标准段落",
        status: "release1_required",
      });
      expect(isTitleBlockVariant(variant)).toBe(false);
      const result = validateTitleBlockLayoutCompatibility(variant);
      expect(result.ok).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("validates heading titleBlock variant with layoutMode", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        id: "heading-underline",
        blockType: "heading",
        componentProtocol: {
          componentId: "titleBlock",
          familyId: "simple",
          layoutMode: "bottom_line",
        },
      });
      expect(isTitleBlockVariant(variant)).toBe(true);
      expect(validateTitleBlockLayoutCompatibility(variant).ok).toBe(true);
    });

    it("integrates with validateVariantDefinition", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        componentProtocol: {
          ...baseTitleVariant.componentProtocol,
          layoutMode: "overlay",
        },
      });
      const result = validateVariantDefinition(variant);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some((i) =>
          i.code.startsWith("title_layout_"),
        ),
      ).toBe(true);
    });

    it("returns StyleValidationResult shape", () => {
      const result = validateTitleBlockLayoutCompatibility(
        variantDefinitionSchema.parse(baseTitleVariant),
      );
      expect(typeof result.ok).toBe("boolean");
      expect(Array.isArray(result.issues)).toBe(true);
    });
  });

  describe("titleBlock catalog layoutMode mapping", () => {
    it("passes canonical enum through normalizeTitleBlockLayoutMode", () => {
      expect(normalizeTitleBlockLayoutMode("plain")).toBe("plain");
      expect(normalizeTitleBlockLayoutMode("bottom_line")).toBe("bottom_line");
    });

    it("maps historical catalog names to canonical enum", () => {
      expect(normalizeTitleBlockLayoutMode("vertical-stack")).toBe("plain");
      expect(normalizeTitleBlockLayoutMode("line-bottom")).toBe("bottom_line");
      expect(normalizeTitleBlockLayoutMode("badge-top")).toBe("top_badge");
      expect(normalizeTitleBlockLayoutMode("offset-bg")).toBe("offset_background");
      expect(normalizeTitleBlockLayoutMode("magazine-left-bar")).toBe(
        "magazine_left_bar",
      );
    });

    it("returns undefined for unknown layoutMode", () => {
      expect(normalizeTitleBlockLayoutMode("unknown-layout")).toBeUndefined();
      expect(mapTitleBlockCatalogLayoutMode("unknown-layout")).toBeUndefined();
    });

    it("schema rejects historical names as primary model", () => {
      expect(() => titleBlockLayoutModeSchema.parse("vertical-stack")).toThrow();
    });
  });
});
