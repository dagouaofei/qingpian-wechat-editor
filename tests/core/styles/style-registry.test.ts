import { describe, expect, it } from "vitest";

import {
  STYLE_SCHEMA_VERSION,
  StyleRegistryError,
  getPresetById,
  getThemeById,
  getVariantById,
  getVariantsForBlockType,
  parseStyleRegistry,
  validateStyleRegistry,
} from "@/core/styles";

function minimalRegistry() {
  return {
    schemaVersion: STYLE_SCHEMA_VERSION,
    themes: [
      {
        id: "default",
        name: "Default",
        schemaVersion: STYLE_SCHEMA_VERSION,
        tokens: { color: { "text.default": "#333" } },
      },
    ],
    presets: [
      {
        id: "classic-news",
        name: "Classic News",
        schemaVersion: STYLE_SCHEMA_VERSION,
        themeId: "default",
        defaultVariantByBlockType: { title: "title-centered" },
      },
    ],
    variants: [
      {
        id: "title-centered",
        schemaVersion: STYLE_SCHEMA_VERSION,
        blockType: "title" as const,
        family: "simple",
        name: "title-centered",
        label: "居中标题",
        status: "release1_required" as const,
      },
      {
        id: "paragraph-standard",
        schemaVersion: STYLE_SCHEMA_VERSION,
        blockType: "paragraph" as const,
        family: "simple",
        name: "paragraph-standard",
        label: "标准段落",
        status: "release1_required" as const,
      },
      {
        id: "magazine_left_bar_title",
        schemaVersion: STYLE_SCHEMA_VERSION,
        blockType: "heading" as const,
        family: "magazine",
        name: "magazine_left_bar_title",
        label: "杂志左栏",
        status: "release1_candidate" as const,
      },
    ],
  };
}

describe("style registry helpers", () => {
  describe("parseStyleRegistry", () => {
    it("parses valid StyleRegistry", () => {
      const registry = parseStyleRegistry(minimalRegistry());
      expect(registry.themes).toHaveLength(1);
      expect(registry.variants).toHaveLength(3);
    });

    it("throws StyleRegistryError on invalid input", () => {
      expect(() => parseStyleRegistry(null)).toThrow(StyleRegistryError);
    });

    it("rejects wrong schemaVersion", () => {
      expect(() =>
        parseStyleRegistry({ ...minimalRegistry(), schemaVersion: 2 }),
      ).toThrow(StyleRegistryError);
    });
  });

  describe("validateStyleRegistry", () => {
    it("returns ok true for valid registry", () => {
      const result = validateStyleRegistry(minimalRegistry());
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.issues).toEqual([]);
      }
    });

    it("returns ok false without throwing", () => {
      const result = validateStyleRegistry({ schemaVersion: 1 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("registry lookups", () => {
    const registry = parseStyleRegistry(minimalRegistry());

    it("getThemeById returns theme", () => {
      expect(getThemeById(registry, "default")?.id).toBe("default");
      expect(getThemeById(registry, "missing")).toBeUndefined();
    });

    it("getPresetById returns preset", () => {
      expect(getPresetById(registry, "classic-news")?.themeId).toBe("default");
      expect(getPresetById(registry, "missing")).toBeUndefined();
    });

    it("getVariantById returns variant", () => {
      expect(getVariantById(registry, "title-centered")?.blockType).toBe(
        "title",
      );
      expect(getVariantById(registry, "missing")).toBeUndefined();
    });

    it("getVariantsForBlockType filters by blockType", () => {
      const titleVariants = getVariantsForBlockType(registry, "title");
      expect(titleVariants).toHaveLength(1);
      expect(titleVariants[0]?.id).toBe("title-centered");

      const paragraphVariants = getVariantsForBlockType(registry, "paragraph");
      expect(paragraphVariants).toHaveLength(1);
      expect(paragraphVariants[0]?.id).toBe("paragraph-standard");
    });
  });
});
