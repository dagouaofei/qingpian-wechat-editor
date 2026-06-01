import { describe, expect, it } from "vitest";

import {
  STYLE_SCHEMA_VERSION,
  slotDefinitionSchema,
  titleBlockLayoutModeSchema,
  validateStyleRegistry,
  validateVariantSlots,
  variantDefinitionSchema,
} from "@/core/styles";
import { minimalStyleRegistryFixture } from "../../fixtures/styles/minimal-registry";

const baseTitleVariant = {
  id: "title-with-slots",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "title" as const,
  family: "simple",
  name: "title-with-slots",
  label: "Title With Slots",
  status: "release1_required" as const,
  componentProtocol: {
    componentId: "titleBlock",
    familyId: "simple",
    layoutMode: "plain",
  },
};

function strictTitleSlot(overrides: Record<string, unknown> = {}) {
  return {
    id: "title",
    role: "title" as const,
    binding: { source: "block.content.text" as const, required: true },
    copySafety: { copySafety: "strict" as const, allowedInCopy: true },
    ...overrides,
  };
}

function badgeSlot(overrides: Record<string, unknown> = {}) {
  return {
    id: "badge",
    role: "badge" as const,
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
    ...overrides,
  };
}

describe("slot copySafety contract", () => {
  describe("slotDefinitionSchema", () => {
    it("parses valid slotDefinition", () => {
      expect(slotDefinitionSchema.parse(strictTitleSlot())).toMatchObject({
        id: "title",
        role: "title",
      });
    });

    it("rejects html fields on slot", () => {
      expect(() =>
        slotDefinitionSchema.parse({
          ...strictTitleSlot(),
          className: "evil",
        }),
      ).toThrow();
    });

    it("rejects invalid binding source", () => {
      expect(() =>
        slotDefinitionSchema.parse({
          ...strictTitleSlot(),
          binding: { source: "block.content.html" },
        }),
      ).toThrow();
    });

    it("rejects variant.presentation as title body source", () => {
      expect(() =>
        slotDefinitionSchema.parse({
          ...strictTitleSlot(),
          binding: { source: "variant.presentation" },
        }),
      ).toThrow();
    });

    it("rejects preview_only with allowedInCopy=true", () => {
      expect(() =>
        slotDefinitionSchema.parse({
          ...badgeSlot(),
          copySafety: { copySafety: "preview_only", allowedInCopy: true },
        }),
      ).toThrow();
    });
  });

  describe("validateVariantSlots", () => {
    it("schema rejects release1_required preview_only slot", () => {
      const parsed = variantDefinitionSchema.safeParse({
        ...baseTitleVariant,
        slots: {
          title: strictTitleSlot(),
          badge: {
            ...badgeSlot(),
            copySafety: { copySafety: "preview_only", allowedInCopy: false },
          },
        },
      });
      expect(parsed.success).toBe(false);
    });

    it("schema rejects allowedInCopy=false on release1_required active slot", () => {
      const parsed = variantDefinitionSchema.safeParse({
        ...baseTitleVariant,
        slots: {
          title: {
            ...strictTitleSlot(),
            copySafety: { copySafety: "strict", allowedInCopy: false },
          },
        },
      });
      expect(parsed.success).toBe(false);
    });

    it("flags fallbackSlotId self reference", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        slots: {
          title: {
            ...strictTitleSlot(),
            copySafety: {
              copySafety: "strict",
              allowedInCopy: true,
              fallbackSlotId: "title",
            },
          },
        },
      });

      const result = validateVariantSlots(variant);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some((i) => i.code === "slot_fallback_self_reference"),
      ).toBe(true);
    });

    it("flags fallbackSlotId pointing to missing slot", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        slots: {
          title: {
            ...strictTitleSlot(),
            copySafety: {
              copySafety: "strict",
              allowedInCopy: true,
              fallbackSlotId: "missing",
            },
          },
        },
      });

      const result = validateVariantSlots(variant);
      expect(result.ok).toBe(false);
      expect(result.issues.some((i) => i.code === "slot_fallback_not_found")).toBe(
        true,
      );
    });

    it("schema rejects assetRegistry as title body source", () => {
      expect(() =>
        slotDefinitionSchema.parse({
          ...strictTitleSlot(),
          binding: { source: "assetRegistry" },
        }),
      ).toThrow();
    });

    it("allows disabled slot without copy participation", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        slots: {
          title: strictTitleSlot(),
          subtitle: {
            id: "subtitle",
            role: "subtitle" as const,
            binding: { source: "disabled" as const },
            copySafety: { copySafety: "strict", allowedInCopy: false },
          },
        },
      });

      const result = validateVariantSlots(variant);
      expect(result.ok).toBe(true);
    });

    it("requires title slot to bind block.content.text for titleBlock required variants", () => {
      const variant = variantDefinitionSchema.parse({
        ...baseTitleVariant,
        slots: {
          title: {
            ...strictTitleSlot(),
            binding: { source: "block.meta" },
          },
        },
      });

      const result = validateVariantSlots(variant);
      expect(result.ok).toBe(false);
      expect(
        result.issues.some((i) => i.code === "title_slot_binding_required"),
      ).toBe(true);
    });
  });

  describe("validateVariantDefinition integration", () => {
    it("rejects release1_required variant with preview_only slot at schema layer", () => {
      expect(() =>
        variantDefinitionSchema.parse({
          ...baseTitleVariant,
          slots: {
            badge: {
              ...badgeSlot(),
              copySafety: { copySafety: "preview_only", allowedInCopy: false },
            },
            title: strictTitleSlot(),
          },
        }),
      ).toThrow();
    });

    it("validateStyleRegistry catches slot issues when slots present", () => {
      const registry = {
        ...minimalStyleRegistryFixture,
        variants: [
          ...minimalStyleRegistryFixture.variants,
          {
            ...baseTitleVariant,
            slots: {
              title: strictTitleSlot(),
              badge: badgeSlot(),
            },
          },
        ],
      };

      const result = validateStyleRegistry(registry);
      expect(result.ok).toBe(true);
    });
  });

  describe("titleBlockLayoutModeSchema", () => {
    it("accepts canonical enum only", () => {
      expect(titleBlockLayoutModeSchema.parse("bottom_line")).toBe("bottom_line");
    });

    it("rejects historical catalog layoutMode names", () => {
      expect(() => titleBlockLayoutModeSchema.parse("vertical-stack")).toThrow();
      expect(() => titleBlockLayoutModeSchema.parse("line-bottom")).toThrow();
    });
  });
});
