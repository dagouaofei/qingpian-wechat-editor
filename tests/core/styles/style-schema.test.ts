import { describe, expect, it } from "vitest";

import {
  STYLE_SCHEMA_VERSION,
  colorTokenRefSchema,
  inlineMarkColorInputSchema,
  presetDefinitionSchema,
  themeDefinitionSchema,
  variantDefinitionSchema,
  variantStatusSchema,
} from "@/core/styles";

const themeFixture = {
  id: "default",
  name: "Default Theme",
  schemaVersion: STYLE_SCHEMA_VERSION,
  tokens: {
    color: {
      "text.default": "#333333",
      "brand.primary": "#0066cc",
    },
    fontSize: {
      body: "16px",
    },
  },
};

const presetFixture = {
  id: "business",
  name: "Classic News",
  schemaVersion: STYLE_SCHEMA_VERSION,
  themeId: "businessBlue",
  description: "Classic news preset",
  defaultVariantByBlockType: {
    title: "title-centered",
    paragraph: "paragraph-standard",
  },
  density: "standard" as const,
};

const variantFixture = {
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
    layoutMode: "plain",
  },
};

describe("style system schema contract", () => {
  describe("themeDefinitionSchema", () => {
    it("parses valid ThemeDefinition", () => {
      expect(themeDefinitionSchema.parse(themeFixture)).toMatchObject({
        id: "default",
        schemaVersion: 1,
      });
    });

    it("rejects wrong schemaVersion", () => {
      expect(() =>
        themeDefinitionSchema.parse({ ...themeFixture, schemaVersion: 2 }),
      ).toThrow();
    });

    it("rejects unknown fields", () => {
      expect(() =>
        themeDefinitionSchema.parse({ ...themeFixture, className: "evil" }),
      ).toThrow();
    });
  });

  describe("presetDefinitionSchema", () => {
    it("parses valid PresetDefinition", () => {
      expect(presetDefinitionSchema.parse(presetFixture)).toMatchObject({
        id: "business",
        themeId: "businessBlue",
      });
    });

    it("rejects invalid block type in defaultVariantByBlockType", () => {
      expect(() =>
        presetDefinitionSchema.parse({
          ...presetFixture,
          defaultVariantByBlockType: { unknown: "x" },
        }),
      ).toThrow();
    });
  });

  describe("variantDefinitionSchema", () => {
    it("parses valid VariantDefinition", () => {
      expect(variantDefinitionSchema.parse(variantFixture)).toMatchObject({
        blockType: "title",
        status: "release1_required",
      });
    });

    it("rejects invalid blockType", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...variantFixture,
          blockType: "unknown",
        }),
      ).toThrow();
    });

    it("rejects html field injection", () => {
      expect(() =>
        variantDefinitionSchema.parse({ ...variantFixture, html: "<p>x</p>" }),
      ).toThrow();
    });

    it("rejects className field injection", () => {
      expect(() =>
        variantDefinitionSchema.parse({ ...variantFixture, className: "evil" }),
      ).toThrow();
    });

    it("rejects style field injection", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...variantFixture,
          style: { color: "red" },
        }),
      ).toThrow();
    });

    it("rejects css field injection", () => {
      expect(() =>
        variantDefinitionSchema.parse({ ...variantFixture, css: ".foo{}" }),
      ).toThrow();
    });

    it("validates variant status enum", () => {
      expect(variantStatusSchema.parse("release1_candidate")).toBe(
        "release1_candidate",
      );
      expect(() => variantStatusSchema.parse("required")).toThrow();
    });

    it("rejects magazine_left_bar_title as release1_required", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...variantFixture,
          id: "magazine_left_bar_title",
          blockType: "heading",
          family: "magazine",
          status: "release1_required",
        }),
      ).toThrow();
    });

    it("allows magazine_left_bar_title as release1_candidate", () => {
      expect(
        variantDefinitionSchema.parse({
          ...variantFixture,
          id: "magazine_left_bar_title",
          blockType: "heading",
          family: "magazine",
          status: "release1_candidate",
        }),
      ).toMatchObject({ status: "release1_candidate" });
    });
  });

  describe("colorTokenRef", () => {
    it("accepts registered ColorTokenRef values", () => {
      expect(colorTokenRefSchema.parse("text.default")).toBe("text.default");
      expect(colorTokenRefSchema.parse("brand.primary")).toBe("brand.primary");
    });

    it("rejects unregistered token ref", () => {
      expect(() => colorTokenRefSchema.parse("brandPrimary")).toThrow();
    });

    it("inlineMarkColorInputSchema accepts token ref as recommended path", () => {
      expect(inlineMarkColorInputSchema.parse("text.accent")).toBe("text.accent");
    });

    it("inlineMarkColorInputSchema accepts legacy raw string for compatibility", () => {
      expect(inlineMarkColorInputSchema.parse("brandPrimary")).toBe(
        "brandPrimary",
      );
    });

    it("inlineMarkColorInputSchema rejects HTML in legacy color", () => {
      expect(() =>
        inlineMarkColorInputSchema.parse("<script>bad</script>"),
      ).toThrow();
    });
  });
});
