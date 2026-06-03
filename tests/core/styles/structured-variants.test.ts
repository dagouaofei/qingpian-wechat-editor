import { describe, expect, it } from "vitest";

import {
  CTA_FIRST_WAVE_VARIANTS,
  FIRST_WAVE_REQUIRED_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STRUCTURED_BLOCK_VARIANT_REGISTRY,
  STRUCTURED_BLOCK_VARIANTS,
  getVariantsForBlockType,
  parseStyleRegistry,
  validateStyleRegistry,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  validateVariantSlots,
  variantDefinitionSchema,
} from "@/core/styles";
import type { VariantDefinition } from "@/core/styles";

const BODY_SOURCE_BY_BLOCK_TYPE = {
  quote: "block.content.text",
  highlight: "block.content.text",
  info_card: "block.content.body",
  cta: "block.content.text",
} as const;

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

function expectValidationOk(variant: VariantDefinition): void {
  const parsed = variantDefinitionSchema.parse(variant);

  const slotResult = validateVariantSlots(parsed);
  expect(slotResult.ok, slotResult.issues.map((i) => i.code).join(", ")).toBe(
    true,
  );

  const wechatResult = validateVariantForWechatCopy(parsed);
  expect(
    wechatResult.ok,
    wechatResult.issues.map((i) => i.code).join(", "),
  ).toBe(true);

  const definitionResult = validateVariantDefinition(parsed);
  expect(
    definitionResult.ok,
    definitionResult.issues.map((i) => i.code).join(", "),
  ).toBe(true);
}

describe("structured first-wave variants", () => {
  it("exports 3 variants per structured block type", () => {
    expect(QUOTE_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(HIGHLIGHT_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(INFO_CARD_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(CTA_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(STRUCTURED_BLOCK_VARIANTS).toHaveLength(15);
  });

  it("has unique ids and release1_required status", () => {
    const ids = STRUCTURED_BLOCK_VARIANTS.map((variant) => variant.id);
    expect(new Set(ids).size).toBe(15);
    expect(
      STRUCTURED_BLOCK_VARIANTS.every(
        (variant) => variant.status === "release1_required",
      ),
    ).toBe(true);
  });

  it("assigns variants to expected block types", () => {
    expect(QUOTE_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "quote")).toBe(
      true,
    );
    expect(
      HIGHLIGHT_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "highlight"),
    ).toBe(true);
    expect(
      INFO_CARD_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "info_card"),
    ).toBe(true);
    expect(CTA_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "cta")).toBe(
      true,
    );
    expect(
      IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS.every(
        (v) => v.blockType === "image_placeholder",
      ),
    ).toBe(true);
  });

  it("does not include preview_only or unsafe inline fields", () => {
    for (const variant of STRUCTURED_BLOCK_VARIANTS) {
      expect(variant.compatibility?.copySafety).not.toBe("preview_only");
      expectNoUnsafeKeys(variant);

      for (const slot of Object.values(variant.slots ?? {})) {
        expect(slot.copySafety.copySafety).not.toBe("preview_only");
        if (slot.binding.source !== "disabled") {
          expect(slot.copySafety.allowedInCopy).toBe(true);
        }
      }
    }
  });

  it("binds quote / highlight / info_card / cta body slots to legal content sources", () => {
    for (const variant of STRUCTURED_BLOCK_VARIANTS) {
      if (!(variant.blockType in BODY_SOURCE_BY_BLOCK_TYPE)) {
        continue;
      }
      const expectedSource =
        BODY_SOURCE_BY_BLOCK_TYPE[
          variant.blockType as keyof typeof BODY_SOURCE_BY_BLOCK_TYPE
        ];
      expect(variant.slots?.body).toBeDefined();
      expect(variant.slots!.body.role).toBe("body");
      expect(variant.slots!.body.binding.source).toBe(expectedSource);
      expect(variant.slots!.body.binding.required).toBe(true);
    }
  });

  it("binds info_card title and body slots to current schema content sources", () => {
    const keyTakeaway = INFO_CARD_FIRST_WAVE_VARIANTS.find(
      (variant) => variant.id === "info_card_key_takeaway",
    )!;

    expect(keyTakeaway.slots?.title.binding.source).toBe("block.content.title");
    expect(keyTakeaway.slots?.body.binding.source).toBe("block.content.body");
  });

  it("binds cta action slots to block.content.action", () => {
    for (const variant of CTA_FIRST_WAVE_VARIANTS) {
      expect(variant.slots?.action).toBeDefined();
      expect(variant.slots!.action.role).toBe("action");
      expect(variant.slots!.action.binding.source).toBe("block.content.action");
    }
  });

  it("keeps image placeholders as contracts without real image binding", () => {
    for (const variant of IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS) {
      expect(variant.slots?.image).toBeDefined();
      expect(variant.slots!.image.role).toBe("image");
      expect(variant.slots!.image.binding.source).toBe("disabled");
      expect(variant.slots!.image.copySafety.allowedInCopy).toBe(false);
    }

    const captionVariant = IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS.find(
      (variant) => variant.id === "image_placeholder_caption",
    )!;
    expect(captionVariant.slots?.caption.binding.source).toBe(
      "block.content.caption",
    );
  });

  it("does not use presentation or assetRegistry as body source", () => {
    for (const variant of STRUCTURED_BLOCK_VARIANTS) {
      for (const slot of Object.values(variant.slots ?? {})) {
        if (["title", "body", "items"].includes(slot.role)) {
          expect(slot.binding.source).not.toBe("variant.presentation");
          expect(slot.binding.source).not.toBe("assetRegistry");
        }
      }
    }
  });

  it("passes schema and validation for all 15 variants", () => {
    for (const variant of STRUCTURED_BLOCK_VARIANTS) {
      expect(() => variantDefinitionSchema.parse(variant)).not.toThrow();
      expectValidationOk(variant);
    }
  });

  it("supports registry lookup by blockType", () => {
    const registry = parseStyleRegistry(STRUCTURED_BLOCK_VARIANT_REGISTRY);

    expect(getVariantsForBlockType(registry, "quote")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "highlight")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "info_card")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "cta")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "image_placeholder")).toHaveLength(
      3,
    );

    const result = validateStyleRegistry(registry);
    expect(result.ok, result.issues.map((i) => i.message).join("; ")).toBe(
      true,
    );
  });

  it("forms the 97-variant release1 aggregate", () => {
    const ids = FIRST_WAVE_REQUIRED_VARIANTS.map((variant) => variant.id);
    expect(FIRST_WAVE_REQUIRED_VARIANTS).toHaveLength(97);
    expect(new Set(ids).size).toBe(97);
  });

  it("lists expected structured ids", () => {
    expect(STRUCTURED_BLOCK_VARIANTS.map((variant) => variant.id)).toEqual([
      "quote_plain",
      "quote_left_bar",
      "quote_card",
      "highlight_inline_emphasis",
      "highlight_accent_band",
      "highlight_soft_card",
      "info_card_key_takeaway",
      "info_card_steps",
      "info_card_warning_note",
      "cta_plain_text",
      "cta_button_like",
      "cta_qr_placeholder",
      "image_placeholder_simple",
      "image_placeholder_caption",
      "image_placeholder_card",
    ]);
  });
});
