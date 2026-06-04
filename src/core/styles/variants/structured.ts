/**
 * Sprint 3-B first-wave structured variants — quote / highlight / info_card / cta / image_placeholder.
 * These are registry definitions only; renderers, QR generation, links, and real image handling are later work.
 *
 * @see docs/architecture/style-system.md
 */

import { STYLE_SCHEMA_VERSION } from "../types";
import type { BlockType } from "@/core/blocks";
import type { CopySafety, SlotDefinition, VariantDefinition } from "../types";

type StructuredBlockType = Extract<
  BlockType,
  "quote" | "highlight" | "info_card" | "cta" | "image_placeholder"
>;

function structuredVariant(config: {
  id: string;
  blockType: StructuredBlockType;
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

function bodyContentSlot(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "body",
    role: "body",
    label: "Body",
    binding: { source: "block.content.body", required: true },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function titleContentSlot(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "title",
    role: "title",
    label: "Title",
    binding: { source: "block.content.title" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function actionContentSlot(copySafety: CopySafety = "strict"): SlotDefinition {
  return {
    id: "action",
    role: "action",
    label: "Action",
    binding: { source: "block.content.action" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function disabledImageSlot(): SlotDefinition {
  return {
    id: "image",
    role: "image",
    label: "Image Placeholder",
    binding: { source: "disabled" },
    copySafety: {
      copySafety: "strict",
      allowedInCopy: false,
      notes: "Real image binding is out of scope for Sprint 3-B registry definitions",
    },
  };
}

function captionContentSlot(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "caption",
    role: "subtitle",
    label: "Caption",
    binding: { source: "block.content.caption" },
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

function presentationBadgeSlot(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "badge",
    role: "badge",
    label: "Badge",
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

export const quotePlain: VariantDefinition = structuredVariant({
  id: "quote_plain",
  blockType: "quote",
  family: "simple",
  name: "quote-plain",
  label: "Plain Quote",
  description: "First-wave plain quote using quote content text",
  copySafety: "strict",
  slots: {
    body: bodyTextSlot("strict"),
  },
});

export const quoteLeftBar: VariantDefinition = structuredVariant({
  id: "quote_left_bar",
  blockType: "quote",
  family: "accent",
  name: "quote-left-bar",
  label: "Left Bar Quote",
  description: "First-wave quote with presentation-only left bar",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const quoteCard: VariantDefinition = structuredVariant({
  id: "quote_card",
  blockType: "quote",
  family: "card",
  name: "quote-card",
  label: "Quote Card",
  description: "First-wave quote card contract without renderer output",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const highlightInlineEmphasis: VariantDefinition = structuredVariant({
  id: "highlight_inline_emphasis",
  blockType: "highlight",
  family: "simple",
  name: "highlight-inline-emphasis",
  label: "Inline Emphasis Highlight",
  description: "First-wave inline emphasis highlight",
  copySafety: "strict",
  slots: {
    body: bodyTextSlot("strict"),
  },
});

export const highlightAccentBand: VariantDefinition = structuredVariant({
  id: "highlight_accent_band",
  blockType: "highlight",
  family: "accent",
  name: "highlight-accent-band",
  label: "Accent Band Highlight",
  description: "First-wave highlight with presentation accent",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const highlightSoftCard: VariantDefinition = structuredVariant({
  id: "highlight_soft_card",
  blockType: "highlight",
  family: "card",
  name: "highlight-soft-card",
  label: "Soft Card Highlight",
  description: "First-wave soft card highlight contract",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const infoCardKeyTakeaway: VariantDefinition = structuredVariant({
  id: "info_card_key_takeaway",
  blockType: "info_card",
  family: "key_takeaway",
  name: "info-card-key-takeaway",
  label: "Key Takeaway Info Card",
  description: "First-wave info card with optional title and required body",
  copySafety: "balanced",
  slots: {
    title: titleContentSlot("balanced"),
    body: bodyContentSlot("balanced"),
  },
});

export const infoCardSteps: VariantDefinition = structuredVariant({
  id: "info_card_steps",
  blockType: "info_card",
  family: "steps",
  name: "info-card-steps",
  label: "Steps Info Card",
  description: "First-wave info card with presentation badge",
  copySafety: "balanced",
  slots: {
    body: bodyContentSlot("balanced"),
    badge: presentationBadgeSlot("balanced"),
  },
});

export const infoCardWarningNote: VariantDefinition = structuredVariant({
  id: "info_card_warning_note",
  blockType: "info_card",
  family: "warning",
  name: "info-card-warning-note",
  label: "Warning Note Info Card",
  description: "First-wave warning note with presentation icon",
  copySafety: "balanced",
  slots: {
    body: bodyContentSlot("balanced"),
    icon: presentationIconSlot("balanced"),
  },
});

export const ctaPlainText: VariantDefinition = structuredVariant({
  id: "cta_plain_text",
  blockType: "cta",
  family: "simple",
  name: "cta-plain-text",
  label: "Plain Text CTA",
  description: "First-wave text-only CTA without real navigation",
  copySafety: "strict",
  slots: {
    body: bodyTextSlot("strict"),
    action: actionContentSlot("strict"),
  },
});

export const ctaButtonLike: VariantDefinition = structuredVariant({
  id: "cta_button_like",
  blockType: "cta",
  family: "button_like",
  name: "cta-button-like",
  label: "Button-like CTA",
  description: "First-wave button-like CTA contract; no HTML button output",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    action: actionContentSlot("balanced"),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const ctaQrPlaceholder: VariantDefinition = structuredVariant({
  id: "cta_qr_placeholder",
  blockType: "cta",
  family: "qr_placeholder",
  name: "cta-qr-placeholder",
  label: "QR Placeholder CTA",
  description: "First-wave QR placeholder contract without QR generation",
  copySafety: "balanced",
  slots: {
    body: bodyTextSlot("balanced"),
    action: actionContentSlot("balanced"),
    icon: presentationIconSlot("balanced"),
  },
});

export const imagePlaceholderSimple: VariantDefinition = structuredVariant({
  id: "image_placeholder_simple",
  blockType: "image_placeholder",
  family: "simple",
  name: "image-placeholder-simple",
  label: "Simple Image Placeholder",
  description: "First-wave image placeholder contract without real image binding",
  copySafety: "strict",
  slots: {
    image: disabledImageSlot(),
  },
});

export const imagePlaceholderCaption: VariantDefinition = structuredVariant({
  id: "image_placeholder_caption",
  blockType: "image_placeholder",
  family: "caption",
  name: "image-placeholder-caption",
  label: "Caption Image Placeholder",
  description: "First-wave image placeholder with optional content caption",
  copySafety: "balanced",
  slots: {
    image: disabledImageSlot(),
    caption: captionContentSlot("balanced"),
  },
});

export const imagePlaceholderCard: VariantDefinition = structuredVariant({
  id: "image_placeholder_card",
  blockType: "image_placeholder",
  family: "card",
  name: "image-placeholder-card",
  label: "Card Image Placeholder",
  description: "First-wave image placeholder card contract without image sourcing",
  copySafety: "balanced",
  slots: {
    image: disabledImageSlot(),
    decoration: presentationDecorationSlot("decoration", "balanced"),
  },
});

export const QUOTE_FIRST_WAVE_VARIANTS = [
  quotePlain,
  quoteLeftBar,
  quoteCard,
] as const;

export const HIGHLIGHT_FIRST_WAVE_VARIANTS = [
  highlightInlineEmphasis,
  highlightAccentBand,
  highlightSoftCard,
] as const;

export const INFO_CARD_FIRST_WAVE_VARIANTS = [
  infoCardKeyTakeaway,
  infoCardSteps,
  infoCardWarningNote,
] as const;

export const CTA_FIRST_WAVE_VARIANTS = [
  ctaPlainText,
  ctaButtonLike,
  ctaQrPlaceholder,
] as const;

export const IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS = [
  imagePlaceholderSimple,
  imagePlaceholderCaption,
  imagePlaceholderCard,
] as const;

export const STRUCTURED_BLOCK_VARIANTS = [
  ...QUOTE_FIRST_WAVE_VARIANTS,
  ...HIGHLIGHT_FIRST_WAVE_VARIANTS,
  ...INFO_CARD_FIRST_WAVE_VARIANTS,
  ...CTA_FIRST_WAVE_VARIANTS,
  ...IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
] as const;

export const STRUCTURED_BLOCK_VARIANT_IDS = STRUCTURED_BLOCK_VARIANTS.map(
  (variant) => variant.id,
);

/** Partial registry fixture — structured first-wave only (not full 33 variants) */
export const STRUCTURED_BLOCK_VARIANT_REGISTRY = {
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
        quote: quotePlain.id,
        highlight: highlightInlineEmphasis.id,
        info_card: infoCardKeyTakeaway.id,
        cta: ctaPlainText.id,
        image_placeholder: imagePlaceholderSimple.id,
      },
    },
  ],
  variants: [...STRUCTURED_BLOCK_VARIANTS],
};
