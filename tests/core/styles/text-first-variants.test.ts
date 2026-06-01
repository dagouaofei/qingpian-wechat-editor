import { describe, expect, it } from "vitest";

import {
  DIVIDER_FIRST_WAVE_VARIANTS,
  IMPLEMENTED_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  TEXT_FIRST_BLOCK_VARIANT_REGISTRY,
  TEXT_FIRST_BLOCK_VARIANTS,
  getVariantsForBlockType,
  parseStyleRegistry,
  validateStyleRegistry,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  validateVariantSlots,
  variantDefinitionSchema,
} from "@/core/styles";
import type { VariantDefinition } from "@/core/styles";

const TEXT_CONTENT_BLOCK_TYPES = ["lead", "paragraph"] as const;

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

describe("text-first first-wave variants", () => {
  it("exports 3 variants per text-first block type", () => {
    expect(LEAD_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(PARAGRAPH_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(DIVIDER_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(LIST_FIRST_WAVE_VARIANTS).toHaveLength(3);
    expect(TEXT_FIRST_BLOCK_VARIANTS).toHaveLength(12);
  });

  it("has unique ids and release1_required status", () => {
    const ids = TEXT_FIRST_BLOCK_VARIANTS.map((variant) => variant.id);
    expect(new Set(ids).size).toBe(12);
    expect(
      TEXT_FIRST_BLOCK_VARIANTS.every(
        (variant) => variant.status === "release1_required",
      ),
    ).toBe(true);
  });

  it("assigns variants to the expected block types", () => {
    expect(LEAD_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "lead")).toBe(
      true,
    );
    expect(
      PARAGRAPH_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "paragraph"),
    ).toBe(true);
    expect(
      DIVIDER_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "divider"),
    ).toBe(true);
    expect(LIST_FIRST_WAVE_VARIANTS.every((v) => v.blockType === "list")).toBe(
      true,
    );
  });

  it("does not include preview_only or unsafe inline fields", () => {
    for (const variant of TEXT_FIRST_BLOCK_VARIANTS) {
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

  it("binds lead / paragraph body slots to block.content.text", () => {
    for (const variant of TEXT_FIRST_BLOCK_VARIANTS) {
      if (
        !(TEXT_CONTENT_BLOCK_TYPES as readonly string[]).includes(
          variant.blockType,
        )
      ) {
        continue;
      }
      expect(variant.slots?.body).toBeDefined();
      expect(variant.slots!.body.role).toBe("body");
      expect(variant.slots!.body.binding.source).toBe("block.content.text");
      expect(variant.slots!.body.binding.required).toBe(true);
    }
  });

  it("binds list item slots to block.content.items", () => {
    for (const variant of LIST_FIRST_WAVE_VARIANTS) {
      expect(variant.slots?.items).toBeDefined();
      expect(variant.slots!.items.role).toBe("items");
      expect(variant.slots!.items.binding.source).toBe("block.content.items");
      expect(variant.slots!.items.binding.required).toBe(true);
    }
  });

  it("does not bind divider variants to body content", () => {
    for (const variant of DIVIDER_FIRST_WAVE_VARIANTS) {
      for (const slot of Object.values(variant.slots ?? {})) {
        expect(["title", "body", "items"]).not.toContain(slot.role);
        expect(slot.binding.source).toBe("variant.presentation");
      }
    }
  });

  it("does not use presentation or assetRegistry as body source", () => {
    for (const variant of TEXT_FIRST_BLOCK_VARIANTS) {
      for (const slot of Object.values(variant.slots ?? {})) {
        if (["title", "body", "items"].includes(slot.role)) {
          expect(slot.binding.source).not.toBe("variant.presentation");
          expect(slot.binding.source).not.toBe("assetRegistry");
        }
      }
    }
  });

  it("passes schema and validation for all 12 variants", () => {
    for (const variant of TEXT_FIRST_BLOCK_VARIANTS) {
      expect(() => variantDefinitionSchema.parse(variant)).not.toThrow();
      expectValidationOk(variant);
    }
  });

  it("supports registry lookup by blockType", () => {
    const registry = parseStyleRegistry(TEXT_FIRST_BLOCK_VARIANT_REGISTRY);

    expect(getVariantsForBlockType(registry, "lead")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "paragraph")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "divider")).toHaveLength(3);
    expect(getVariantsForBlockType(registry, "list")).toHaveLength(3);

    const result = validateStyleRegistry(registry);
    expect(result.ok, result.issues.map((i) => i.message).join("; ")).toBe(
      true,
    );
  });

  it("keeps implemented first-wave aggregate explicit and incomplete", () => {
    expect(IMPLEMENTED_FIRST_WAVE_VARIANTS).toHaveLength(18);
    expect(TEXT_FIRST_BLOCK_VARIANTS).toHaveLength(12);
  });

  it("lists expected text-first ids", () => {
    expect(TEXT_FIRST_BLOCK_VARIANTS.map((variant) => variant.id)).toEqual([
      "lead_plain_intro",
      "lead_accent_band",
      "lead_quote_intro",
      "paragraph_plain_body",
      "paragraph_accent_left",
      "paragraph_soft_card",
      "divider_simple_line",
      "divider_dotted_line",
      "divider_section_space",
      "list_plain_bullets",
      "list_numbered_steps",
      "list_checklist_cards",
    ]);
  });
});
