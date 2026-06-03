/**
 * Sprint 3-B first-wave text-first variants — lead / paragraph / divider / list.
 * These are registry definitions only; renderers are implemented in later sprints.
 *
 * @see docs/architecture/style-system.md
 */

import { STYLE_SCHEMA_VERSION } from "../types";
import type { BlockType } from "@/core/blocks";
import type { CopySafety, SlotDefinition, VariantDefinition } from "../types";

type TextFirstBlockType = Extract<
  BlockType,
  "lead" | "paragraph" | "divider" | "list"
>;

function textFirstVariant(config: {
  id: string;
  blockType: TextFirstBlockType;
  family: string;
  name: string;
  label: string;
  description?: string;
  copySafety: CopySafety;
  slots: Record<string, SlotDefinition>;
  tokens?: VariantDefinition["tokens"];
}): VariantDefinition {
  return {
    id: config.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: config.blockType,
    family: config.family,
    name: config.name,
    label: config.label,
    description: config.description,
    status: "release1_required",
    compatibility: {
      copySafety: config.copySafety,
    },
    slots: config.slots,
    tokens: config.tokens,
  };
}

function bodyTextSlot(copySafety: CopySafety = "strict"): SlotDefinition {
  return {
    id: "body",
    role: "body",
    label: "Body",
    binding: { source: "block.content.text", required: true },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function listItemsSlot(copySafety: CopySafety = "strict"): SlotDefinition {
  return {
    id: "items",
    role: "items",
    label: "Items",
    binding: { source: "block.content.items", required: true },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationDecorationSlot(
  id = "decoration",
  copySafety: CopySafety = "balanced",
): SlotDefinition {
  return {
    id,
    role: "decoration",
    label: "Decoration",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationDividerSlot(
  id = "divider",
  copySafety: CopySafety = "strict",
): SlotDefinition {
  return {
    id,
    role: "divider",
    label: "Divider",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationIconSlot(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "icon",
    role: "icon",
    label: "Icon",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

export const leadPlainIntro: VariantDefinition = textFirstVariant({
  id: "lead_plain_intro",
  blockType: "lead",
  family: "simple",
  name: "lead-plain-intro",
  label: "Plain Intro Lead",
  description: "First-wave text-only lead for article introductions",
  copySafety: "strict",
  slots: {
    body: bodyTextSlot("strict"),
  },
  tokens: {
    "typography.weight": "regular",
    "spacing.block": "18px",
  },
});

export const leadAccentBand: VariantDefinition = textFirstVariant({
  id: "lead_accent_band",
  blockType: "lead",
  family: "accent",
  name: "lead-accent-band",
  label: "Accent Band Lead",
  description: "First-wave lead with a copy-safe presentation accent",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const leadQuoteIntro: VariantDefinition = textFirstVariant({
  id: "lead_quote_intro",
  blockType: "lead",
  family: "quote",
  name: "lead-quote-intro",
  label: "Quote Intro Lead",
  description: "First-wave quote-like lead without generating body content",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const paragraphPlainBody: VariantDefinition = textFirstVariant({
  id: "paragraph_plain_body",
  blockType: "paragraph",
  family: "simple",
  name: "paragraph-plain-body",
  label: "Plain Body Paragraph",
  description: "First-wave plain paragraph body",
  copySafety: "strict",
  slots: {
    body: bodyTextSlot("strict"),
  },
});

export const paragraphAccentLeft: VariantDefinition = textFirstVariant({
  id: "paragraph_accent_left",
  blockType: "paragraph",
  family: "accent",
  name: "paragraph-accent-left",
  label: "Accent Left Paragraph",
  description: "First-wave paragraph with presentation-only left accent",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const paragraphSoftCard: VariantDefinition = textFirstVariant({
  id: "paragraph_soft_card",
  blockType: "paragraph",
  family: "card",
  name: "paragraph-soft-card",
  label: "Soft Card Paragraph",
  description: "First-wave paragraph in a lightweight presentation card",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const dividerSimpleLine: VariantDefinition = textFirstVariant({
  id: "divider_simple_line",
  blockType: "divider",
  family: "simple",
  name: "divider-simple-line",
  label: "Simple Line Divider",
  description: "First-wave simple line divider",
  copySafety: "strict",
  slots: {
    divider: presentationDividerSlot("divider", "strict"),
  },
});

export const dividerDottedLine: VariantDefinition = textFirstVariant({
  id: "divider_dotted_line",
  blockType: "divider",
  family: "simple",
  name: "divider-dotted-line",
  label: "Dotted Line Divider",
  description: "First-wave dotted divider represented as presentation",
  copySafety: "balanced",
  slots: {
    divider: presentationDividerSlot("divider", "balanced"),
  },
});

export const dividerSectionSpace: VariantDefinition = textFirstVariant({
  id: "divider_section_space",
  blockType: "divider",
  family: "space",
  name: "divider-section-space",
  label: "Section Space Divider",
  description: "First-wave spacing divider without body content",
  copySafety: "strict",
  slots: {
    divider: presentationDividerSlot("divider", "strict"),
  },
});

export const listPlainBullets: VariantDefinition = textFirstVariant({
  id: "list_plain_bullets",
  blockType: "list",
  family: "simple",
  name: "list-plain-bullets",
  label: "Plain Bullet List",
  description: "First-wave plain bullet list",
  copySafety: "strict",
  slots: {
    items: listItemsSlot("strict"),
  },
});

export const listNumberedSteps: VariantDefinition = textFirstVariant({
  id: "list_numbered_steps",
  blockType: "list",
  family: "numbered",
  name: "list-numbered-steps",
  label: "Numbered Steps List",
  description: "First-wave numbered list with presentation marker",
  copySafety: "balanced",
  slots: {
    items: listItemsSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const listChecklistCards: VariantDefinition = textFirstVariant({
  id: "list_checklist_cards",
  blockType: "list",
  family: "checklist",
  name: "list-checklist-cards",
  label: "Checklist Cards List",
  description: "First-wave checklist-style list without generated item text",
  copySafety: "balanced",
  slots: {
    items: listItemsSlot("balanced"),
    icon: presentationIconSlot("balanced"),
  },
});

export const LEAD_FIRST_WAVE_VARIANTS = [
  leadPlainIntro,
  leadAccentBand,
  leadQuoteIntro,
] as const;

export const PARAGRAPH_FIRST_WAVE_VARIANTS = [
  paragraphPlainBody,
  paragraphAccentLeft,
  paragraphSoftCard,
] as const;

export const DIVIDER_FIRST_WAVE_VARIANTS = [
  dividerSimpleLine,
  dividerDottedLine,
  dividerSectionSpace,
] as const;

export const LIST_FIRST_WAVE_VARIANTS = [
  listPlainBullets,
  listNumberedSteps,
  listChecklistCards,
] as const;

export const TEXT_FIRST_BLOCK_VARIANTS = [
  ...LEAD_FIRST_WAVE_VARIANTS,
  ...PARAGRAPH_FIRST_WAVE_VARIANTS,
  ...DIVIDER_FIRST_WAVE_VARIANTS,
  ...LIST_FIRST_WAVE_VARIANTS,
] as const;

export const TEXT_FIRST_BLOCK_VARIANT_IDS = TEXT_FIRST_BLOCK_VARIANTS.map(
  (variant) => variant.id,
);

/** Partial registry fixture — text-first first-wave only (not full 33 variants) */
export const TEXT_FIRST_BLOCK_VARIANT_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "businessBlue",
      name: "商务蓝",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: { "text.default": "#333333" },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "business",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        lead: leadPlainIntro.id,
        paragraph: paragraphPlainBody.id,
        divider: dividerSimpleLine.id,
        list: listPlainBullets.id,
      },
    },
  ],
  variants: [...TEXT_FIRST_BLOCK_VARIANTS],
};
