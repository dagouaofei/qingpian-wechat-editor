import { describe, expect, it } from "vitest";

import {
  STYLE_SCHEMA_VERSION,
  WECHAT_MP_COMPATIBILITY_PROFILE,
  variantDefinitionSchema,
  weChatCompatibilityProfileSchema,
  validateCssDeclarationCompatibility,
  validateCssPropertyCompatibility,
  validateVariantWechatCompatibility,
} from "@/core/styles";

const baseVariant = {
  id: "title-centered",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "title" as const,
  family: "simple",
  name: "title-centered",
  label: "居中标题",
  status: "release1_required" as const,
};

describe("wechat compatibility profile", () => {
  describe("WECHAT_MP_COMPATIBILITY_PROFILE", () => {
    it("default profile schema is valid", () => {
      expect(
        weChatCompatibilityProfileSchema.parse(WECHAT_MP_COMPATIBILITY_PROFILE),
      ).toMatchObject({
        id: "wechat-mp-editor-v1",
        schemaVersion: 1,
        target: "wechat_mp_editor",
      });
    });

    it("has Release 1 fallback policy defaults", () => {
      expect(WECHAT_MP_COMPATIBILITY_PROFILE.fallbackPolicy).toMatchObject({
        onForbiddenCss: "reject",
        onRiskyCss: "warn",
        previewOnlyAllowed: false,
      });
    });
  });

  describe("validateCssPropertyCompatibility", () => {
    it("allows safe typography properties", () => {
      const result = validateCssPropertyCompatibility("font-size");
      expect(result.ok).toBe(true);
      expect(result.level).toBe("allowed");
      expect(result.issues).toHaveLength(0);
    });

    it("marks risky properties with warning issue", () => {
      const result = validateCssPropertyCompatibility("box-shadow");
      expect(result.ok).toBe(false);
      expect(result.level).toBe("risky");
      expect(result.issues.some((i) => i.severity === "warning")).toBe(true);
    });

    it("marks forbidden properties with error issue", () => {
      const result = validateCssPropertyCompatibility("animation");
      expect(result.ok).toBe(false);
      expect(result.level).toBe("forbidden");
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("does not silent allow unknown properties", () => {
      const result = validateCssPropertyCompatibility("filter");
      expect(result.ok).toBe(false);
      expect(result.level).toBe("unknown");
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe("validateCssDeclarationCompatibility", () => {
    it("allows allowed declaration", () => {
      const result = validateCssDeclarationCompatibility("color: #333");
      expect(result.ok).toBe(true);
      expect(result.level).toBe("allowed");
    });

    it("marks display:flex as risky", () => {
      const result = validateCssDeclarationCompatibility("display: flex");
      expect(result.level).toBe("risky");
      expect(result.issues.some((i) => i.code === "css_declaration_risky")).toBe(
        true,
      );
    });

    it("marks position:absolute as forbidden", () => {
      const result = validateCssDeclarationCompatibility("position: absolute");
      expect(result.level).toBe("forbidden");
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("forbids CSS variables", () => {
      const result = validateCssDeclarationCompatibility("color: var(--brand)");
      expect(result.level).toBe("forbidden");
      expect(result.issues.some((i) => i.code === "css_variable")).toBe(true);
    });

    it("forbids selector rules", () => {
      const result = validateCssDeclarationCompatibility(".foo { color: red }");
      expect(result.level).toBe("forbidden");
      expect(result.issues.some((i) => i.code === "selector_rule")).toBe(true);
    });

    it("forbids pseudo selectors", () => {
      const result = validateCssDeclarationCompatibility("::before");
      expect(result.level).toBe("forbidden");
      expect(result.issues.some((i) => i.code === "pseudo_selector")).toBe(true);
    });

    it("forbids Tailwind className dependency", () => {
      const result = validateCssDeclarationCompatibility('className="flex p-4"');
      expect(result.level).toBe("forbidden");
      expect(
        result.issues.some((i) => i.code === "tailwind_class_dependency"),
      ).toBe(true);
    });
  });

  describe("validateVariantWechatCompatibility", () => {
    it("passes for release1_required strict variant", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: { copySafety: "strict" },
      });
      const result = validateVariantWechatCompatibility(variant);
      expect(result.ok).toBe(true);
      expect(result.blocking).toBe(false);
    });

    it("blocks release1_required + preview_only", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...baseVariant,
          compatibility: { copySafety: "preview_only" },
        }),
      ).toThrow();

      const variant = {
        ...baseVariant,
        compatibility: { copySafety: "preview_only" as const },
      };
      const result = validateVariantWechatCompatibility(variant);
      expect(result.blocking).toBe(true);
      expect(
        result.issues.some((i) => i.code === "preview_only_release1_required"),
      ).toBe(true);
    });

    it("allows release1_candidate + preview_only with copy-path warning", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        id: "experimental-title",
        status: "release1_candidate",
        compatibility: { copySafety: "preview_only" },
      });
      const result = validateVariantWechatCompatibility(variant);
      expect(result.blocking).toBe(false);
      expect(
        result.issues.some((i) => i.code === "preview_only_copy_path_blocked"),
      ).toBe(true);
    });

    it("captures variant declared forbiddenCssProperties", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: {
          copySafety: "strict",
          wechat: {
            forbiddenCssProperties: ["position: absolute"],
          },
        },
      });
      const result = validateVariantWechatCompatibility(variant);
      expect(result.blocking).toBe(true);
      expect(
        result.issues.some((i) => i.code === "variant_declared_forbidden_css"),
      ).toBe(true);
    });

    it("captures variant declared riskyCssProperties", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseVariant,
        compatibility: {
          copySafety: "balanced",
          wechat: {
            riskyCssProperties: ["display: flex"],
          },
        },
      });
      const result = validateVariantWechatCompatibility(variant);
      expect(
        result.issues.some((i) => i.code === "variant_declared_risky_css"),
      ).toBe(true);
      expect(result.issues.some((i) => i.severity === "warning")).toBe(true);
    });
  });

  describe("regression", () => {
    it("does not break existing variant schema fixtures", () => {
      expect(
        variantDefinitionSchema.parse({
          ...baseVariant,
          componentProtocol: {
            componentId: "titleBlock",
            familyId: "simple",
            layoutMode: "plain",
          },
        }),
      ).toMatchObject({ id: "title-centered" });
    });
  });
});
