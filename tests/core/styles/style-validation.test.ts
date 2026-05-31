import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  RELEASE1_FALLBACK_VARIANT_POLICY,
  STYLE_SCHEMA_VERSION,
  copySafetySchema,
  normalizeCopySafetyInput,
  parseStyleRegistry,
  resolveArticleStyle,
  validateCssDeclarationCompatibility,
  validateResolvedArticleStyle,
  validateStyleRegistry,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  variantDefinitionSchema,
} from "@/core/styles";
import { minimalArticleFixture } from "../../fixtures/articles";
import { minimalStyleRegistryFixture } from "../../fixtures/styles/minimal-registry";

const baseVariant = {
  id: "title-centered",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "title" as const,
  family: "simple",
  name: "title-centered",
  label: "居中标题",
  status: "release1_required" as const,
};

describe("style validation policy", () => {
  describe("copySafety enum", () => {
    it("accepts strict | balanced | preview_only", () => {
      expect(copySafetySchema.parse("strict")).toBe("strict");
      expect(copySafetySchema.parse("balanced")).toBe("balanced");
      expect(copySafetySchema.parse("preview_only")).toBe("preview_only");
    });

    it("rejects legacy safe / risky values in schema", () => {
      expect(() => copySafetySchema.parse("safe")).toThrow();
      expect(() => copySafetySchema.parse("risky")).toThrow();
    });

    it("maps legacy safe/risky via normalizeCopySafetyInput helper only", () => {
      expect(normalizeCopySafetyInput("safe")).toBe("strict");
      expect(normalizeCopySafetyInput("risky")).toBe("balanced");
      expect(normalizeCopySafetyInput("strict")).toBe("strict");
    });
  });

  describe("RELEASE1_FALLBACK_VARIANT_POLICY", () => {
    it("disallows experimental fallback and preview_only in copy", () => {
      expect(RELEASE1_FALLBACK_VARIANT_POLICY).toMatchObject({
        allowExperimentalFallback: false,
        allowPreviewOnlyInCopy: false,
        onForbiddenCss: "error",
        onRiskyCss: "warning",
      });
    });
  });

  describe("validateVariantForWechatCopy", () => {
    it("returns ok for allowed CSS", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: {
          copySafety: "strict",
          wechat: { allowedCssProperties: ["color: #333"] },
        },
      });
      const result = validateVariantForWechatCopy(variant);
      expect(result.ok).toBe(true);
    });

    it("returns warning for risky CSS", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: {
          copySafety: "balanced",
          wechat: { riskyCssProperties: ["display: flex"] },
        },
      });
      const result = validateVariantForWechatCopy(variant);
      expect(result.ok).toBe(true);
      expect(result.issues.some((i) => i.severity === "warning")).toBe(true);
    });

    it("returns error for forbidden CSS", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: {
          copySafety: "strict",
          wechat: { forbiddenCssProperties: ["position: absolute"] },
        },
      });
      const result = validateVariantForWechatCopy(variant);
      expect(result.ok).toBe(false);
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("rejects release1_required + preview_only", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...baseVariant,
          compatibility: { copySafety: "preview_only" },
        }),
      ).toThrow();
    });

    it("warns for release1_candidate + preview_only copy path", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        id: "preview-title",
        status: "release1_candidate",
        compatibility: { copySafety: "preview_only" },
      });
      const result = validateVariantForWechatCopy(variant);
      expect(result.ok).toBe(true);
      expect(
        result.issues.some((i) => i.code === "preview_only_copy_path_blocked"),
      ).toBe(true);
    });

    it("maps CSS variable / selector / pseudo issues into StyleValidationIssue", () => {
      for (const declaration of [
        "color: var(--brand)",
        ".foo { color: red }",
        "::before",
      ]) {
        const cssResult = validateCssDeclarationCompatibility(declaration);
        expect(cssResult.ok).toBe(false);
        expect(cssResult.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("validateStyleRegistry", () => {
    it("validates minimal registry successfully", () => {
      const registry = parseStyleRegistry(minimalStyleRegistryFixture);
      const result = validateStyleRegistry(registry);
      expect(result.ok).toBe(true);
    });

    it("reports magazine_left_bar_title as release1_required", () => {
      const registry = {
        ...minimalStyleRegistryFixture,
        variants: minimalStyleRegistryFixture.variants.map((variant) =>
          variant.id === "magazine_left_bar_title"
            ? { ...variant, status: "release1_required" as const }
            : variant,
        ),
      };
      const result = validateStyleRegistry(registry);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some(
          (i) =>
            i.code === "magazine_left_bar_title_not_required" ||
            i.message.includes("magazine_left_bar_title"),
        ),
      ).toBe(true);
    });
  });

  describe("validateVariantDefinition", () => {
    it("rejects legacy safe copySafety in schema", () => {
      const result = validateVariantDefinition({
        ...baseVariant,
        compatibility: { copySafety: "safe" as never },
      });
      expect(result.ok).toBe(false);
    });
  });

  describe("validateResolvedArticleStyle", () => {
    it("validates resolved article without mutating input", () => {
      const article = parseArticle(minimalArticleFixture);
      const registry = parseStyleRegistry(minimalStyleRegistryFixture);
      const resolved = resolveArticleStyle(article, registry);
      const snapshot = structuredClone(resolved);
      const result = validateResolvedArticleStyle(resolved);
      expect(resolved).toEqual(snapshot);
      expect(result.ok).toBe(true);
    });

    it("records fallback resolve issues as warnings", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: minimalArticleFixture.blocks[0]!.id,
              variantId: "missing-variant",
            },
          ],
        },
      });
      const registry = parseStyleRegistry(minimalStyleRegistryFixture);
      const resolved = resolveArticleStyle(article, registry);
      const result = validateResolvedArticleStyle(resolved);
      expect(
        result.issues.some(
          (i) =>
            i.code === "variant_not_found" ||
            i.code === "variant_resolve_fallback",
        ),
      ).toBe(true);
    });

    it("ok is true when only warnings exist", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: minimalArticleFixture.blocks[0]!.id,
              variantId: "missing-variant",
            },
          ],
        },
      });
      const registry = parseStyleRegistry(minimalStyleRegistryFixture);
      const resolved = resolveArticleStyle(article, registry);
      const result = validateResolvedArticleStyle(resolved);
      const hasError = result.issues.some((i) => i.severity === "error");
      if (!hasError) {
        expect(result.ok).toBe(true);
      }
    });
  });
});
