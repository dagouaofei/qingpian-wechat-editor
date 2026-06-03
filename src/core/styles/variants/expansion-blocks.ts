/**
 * Release 1 expansion variants — +6 per block type (heading +4 in title-heading.ts).
 * @see DECISION-083
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { BlockType } from "@/core/blocks";
import type { CopySafety, SlotDefinition, TitleBlockLayoutMode, VariantDefinition } from "../types";

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

function presentationDecoration(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "decoration",
    role: "decoration",
    label: "Decoration",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationDivider(copySafety: CopySafety = "strict"): SlotDefinition {
  return {
    id: "divider",
    role: "divider",
    label: "Divider",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationIcon(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "icon",
    role: "icon",
    label: "Icon",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function presentationBadge(copySafety: CopySafety = "balanced"): SlotDefinition {
  return {
    id: "badge",
    role: "badge",
    label: "Badge",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety, allowedInCopy: true },
  };
}

function textFirstExpansion(
  config: {
    id: string;
    blockType: Extract<BlockType, "lead" | "paragraph" | "divider" | "list">;
    family: string;
    label: string;
    copySafety?: CopySafety;
    slots: Record<string, SlotDefinition>;
    tokens?: VariantDefinition["tokens"];
  },
): VariantDefinition {
  return {
    id: config.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: config.blockType,
    family: config.family,
    name: config.id,
    label: config.label,
    status: "release1_required",
    compatibility: { copySafety: config.copySafety ?? "balanced" },
    slots: config.slots,
    tokens: config.tokens,
  };
}

function structuredExpansion(
  config: {
    id: string;
    blockType: Extract<BlockType, "quote" | "highlight" | "info_card" | "cta" | "image_placeholder">;
    family: string;
    label: string;
    copySafety?: CopySafety;
    slots: Record<string, SlotDefinition>;
    tokens?: VariantDefinition["tokens"];
  },
): VariantDefinition {
  return structuredExpansionInner(config);
}

function structuredExpansionInner(config: {
  id: string;
  blockType: Extract<BlockType, "quote" | "highlight" | "info_card" | "cta" | "image_placeholder">;
  family: string;
  label: string;
  copySafety?: CopySafety;
  slots: Record<string, SlotDefinition>;
  tokens?: VariantDefinition["tokens"];
}): VariantDefinition {
  return {
    id: config.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: config.blockType,
    family: config.family,
    name: config.id,
    label: config.label,
    status: "release1_required",
    compatibility: { copySafety: config.copySafety ?? "balanced" },
    slots: config.slots,
    tokens: config.tokens,
  };
}

function titleTextSlot(): SlotDefinition {
  return {
    id: "title",
    role: "title",
    label: "Title",
    binding: { source: "block.content.text", required: true },
    copySafety: { copySafety: "strict", allowedInCopy: true },
  };
}

function headingExpansion(
  config: {
    id: string;
    family: string;
    label: string;
    layoutMode: TitleBlockLayoutMode;
    slots?: VariantDefinition["slots"];
  },
): VariantDefinition {
  return {
    id: config.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: "heading",
    family: config.family,
    name: config.id,
    label: config.label,
    status: "release1_required",
    componentProtocol: {
      componentId: TITLE_BLOCK_COMPONENT_ID,
      familyId: config.family,
      layoutMode: config.layoutMode,
    },
    compatibility: { copySafety: "balanced" },
    slots: config.slots ?? { title: titleTextSlot(), decoration: presentationDecoration() },
    tokens: { "typography.size": "18px", "spacing.block": "24px" },
  };
}

export const headingUnderlineClassic = headingExpansion({
  id: "heading_underline_classic",
  family: "underline",
  label: "Underline Classic Heading",
  layoutMode: "underline",
});

export const headingPillTopic = headingExpansion({
  id: "heading_pill_topic",
  family: "pill",
  label: "Pill Topic Heading",
  layoutMode: "pill",
  slots: { title: titleTextSlot(), badge: presentationBadge() },
});

export const headingEditorialPlain = headingExpansion({
  id: "heading_editorial_plain",
  family: "editorial",
  label: "Editorial Plain Heading",
  layoutMode: "plain",
});

export const headingKeynoteStrong = headingExpansion({
  id: "heading_keynote_strong",
  family: "keynote",
  label: "Keynote Strong Heading",
  layoutMode: "keynote_bar",
});

export const LEAD_EXPANSION_VARIANTS = [
  textFirstExpansion({
    id: "lead_business_brief",
    blockType: "lead",
    family: "business",
    label: "Business Brief Lead",
    slots: { body: bodyTextSlot("strict"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "lead_warm_story",
    blockType: "lead",
    family: "warm",
    label: "Warm Story Lead",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "lead_magazine_pull",
    blockType: "lead",
    family: "magazine",
    label: "Magazine Pull Lead",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "lead_keynote_hook",
    blockType: "lead",
    family: "keynote",
    label: "Keynote Hook Lead",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "lead_notebook_highlight",
    blockType: "lead",
    family: "notebook",
    label: "Notebook Highlight Lead",
    slots: { body: bodyTextSlot("balanced"), icon: presentationIcon() },
  }),
  textFirstExpansion({
    id: "lead_dense_summary",
    blockType: "lead",
    family: "dense",
    label: "Dense Summary Lead",
    copySafety: "strict",
    slots: { body: bodyTextSlot("strict") },
    tokens: { "spacing.block": "14px" },
  }),
] as const;

export const PARAGRAPH_EXPANSION_VARIANTS = [
  textFirstExpansion({
    id: "paragraph_compact_rhythm",
    blockType: "paragraph",
    family: "compact",
    label: "Compact Rhythm Paragraph",
    slots: { body: bodyTextSlot("strict") },
    tokens: { "spacing.block": "12px" },
  }),
  textFirstExpansion({
    id: "paragraph_indent_classic",
    blockType: "paragraph",
    family: "indent",
    label: "Indent Classic Paragraph",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "paragraph_highlight_inline",
    blockType: "paragraph",
    family: "highlight",
    label: "Highlight Inline Paragraph",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "paragraph_magazine_measure",
    blockType: "paragraph",
    family: "magazine",
    label: "Magazine Measure Paragraph",
    slots: { body: bodyTextSlot("balanced") },
  }),
  textFirstExpansion({
    id: "paragraph_notebook_margin",
    blockType: "paragraph",
    family: "notebook",
    label: "Notebook Margin Paragraph",
    slots: { body: bodyTextSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "paragraph_callout_soft",
    blockType: "paragraph",
    family: "callout",
    label: "Callout Soft Paragraph",
    slots: { body: bodyTextSlot("balanced"), icon: presentationIcon() },
  }),
] as const;

export const DIVIDER_EXPANSION_VARIANTS = [
  textFirstExpansion({
    id: "divider_dash_editorial",
    blockType: "divider",
    family: "dash",
    label: "Dash Editorial Divider",
    slots: { divider: presentationDivider("balanced") },
  }),
  textFirstExpansion({
    id: "divider_hair_keynote",
    blockType: "divider",
    family: "hair",
    label: "Hair Keynote Divider",
    slots: { divider: presentationDivider("strict") },
  }),
  textFirstExpansion({
    id: "divider_dot_warm",
    blockType: "divider",
    family: "dots",
    label: "Dot Warm Divider",
    slots: { divider: presentationDivider("balanced") },
  }),
  textFirstExpansion({
    id: "divider_short_accent",
    blockType: "divider",
    family: "short",
    label: "Short Accent Divider",
    slots: { divider: presentationDivider("balanced") },
  }),
  textFirstExpansion({
    id: "divider_space_wide",
    blockType: "divider",
    family: "wide",
    label: "Wide Space Divider",
    slots: { divider: presentationDivider("strict") },
    tokens: { "spacing.block": "40px" },
  }),
  textFirstExpansion({
    id: "divider_label_center",
    blockType: "divider",
    family: "label",
    label: "Label Center Divider",
    slots: { divider: presentationDivider("balanced"), decoration: presentationDecoration() },
  }),
] as const;

export const LIST_EXPANSION_VARIANTS = [
  textFirstExpansion({
    id: "list_compact_bullets",
    blockType: "list",
    family: "compact",
    label: "Compact Bullets List",
    slots: { items: listItemsSlot("strict") },
  }),
  textFirstExpansion({
    id: "list_step_cards",
    blockType: "list",
    family: "steps",
    label: "Step Cards List",
    slots: { items: listItemsSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "list_icon_bullets",
    blockType: "list",
    family: "icon",
    label: "Icon Bullets List",
    slots: { items: listItemsSlot("balanced"), icon: presentationIcon() },
  }),
  textFirstExpansion({
    id: "list_two_column",
    blockType: "list",
    family: "two_col",
    label: "Two Column List",
    slots: { items: listItemsSlot("balanced"), decoration: presentationDecoration() },
  }),
  textFirstExpansion({
    id: "list_priority_stack",
    blockType: "list",
    family: "priority",
    label: "Priority Stack List",
    slots: { items: listItemsSlot("balanced"), badge: presentationBadge() },
  }),
  textFirstExpansion({
    id: "list_timeline_markers",
    blockType: "list",
    family: "timeline",
    label: "Timeline Markers List",
    slots: { items: listItemsSlot("balanced"), decoration: presentationDecoration() },
  }),
] as const;

function quoteBodySlots(): Record<string, SlotDefinition> {
  return {
    body: {
      id: "body",
      role: "body",
      label: "Quote",
      binding: { source: "block.content.text", required: true },
      copySafety: { copySafety: "balanced", allowedInCopy: true },
    },
    decoration: presentationDecoration(),
  };
}

export const QUOTE_EXPANSION_VARIANTS = [
  structuredExpansion({
    id: "quote_soft_card",
    blockType: "quote",
    family: "soft_card",
    label: "Soft Card Quote",
    slots: quoteBodySlots(),
  }),
  structuredExpansion({
    id: "quote_center_mark",
    blockType: "quote",
    family: "center",
    label: "Center Mark Quote",
    slots: quoteBodySlots(),
  }),
  structuredExpansion({
    id: "quote_label_chip",
    blockType: "quote",
    family: "label",
    label: "Label Chip Quote",
    slots: { ...quoteBodySlots(), badge: presentationBadge() },
  }),
  structuredExpansion({
    id: "quote_dark_band",
    blockType: "quote",
    family: "dark",
    label: "Dark Band Quote",
    slots: quoteBodySlots(),
  }),
  structuredExpansion({
    id: "quote_minimal_serif",
    blockType: "quote",
    family: "serif",
    label: "Minimal Serif Quote",
    copySafety: "strict",
    slots: {
      body: {
        id: "body",
        role: "body",
        label: "Quote",
        binding: { source: "block.content.text", required: true },
        copySafety: { copySafety: "strict", allowedInCopy: true },
      },
    },
  }),
  structuredExpansion({
    id: "quote_brand_callout",
    blockType: "quote",
    family: "callout",
    label: "Brand Callout Quote",
    slots: quoteBodySlots(),
  }),
] as const;

function highlightBodySlots(): Record<string, SlotDefinition> {
  return {
    body: bodyTextSlot("balanced"),
    badge: presentationBadge(),
  };
}

export const HIGHLIGHT_EXPANSION_VARIANTS = [
  structuredExpansion({
    id: "highlight_marker_warm",
    blockType: "highlight",
    family: "marker",
    label: "Marker Warm Highlight",
    slots: highlightBodySlots(),
  }),
  structuredExpansion({
    id: "highlight_flat_business",
    blockType: "highlight",
    family: "flat",
    label: "Flat Business Highlight",
    slots: { body: bodyTextSlot("strict") },
  }),
  structuredExpansion({
    id: "highlight_border_glow",
    blockType: "highlight",
    family: "glow",
    label: "Border Glow Highlight",
    slots: highlightBodySlots(),
  }),
  structuredExpansion({
    id: "highlight_notebook",
    blockType: "highlight",
    family: "notebook",
    label: "Notebook Highlight",
    slots: highlightBodySlots(),
  }),
  structuredExpansion({
    id: "highlight_keynote_box",
    blockType: "highlight",
    family: "keynote",
    label: "Keynote Box Highlight",
    slots: highlightBodySlots(),
  }),
  structuredExpansion({
    id: "highlight_tip_pill",
    blockType: "highlight",
    family: "pill",
    label: "Tip Pill Highlight",
    slots: highlightBodySlots(),
  }),
] as const;

function infoCardSlots(): Record<string, SlotDefinition> {
  return {
    title: {
      id: "title",
      role: "title",
      label: "Title",
      binding: { source: "block.content.title" },
      copySafety: { copySafety: "balanced", allowedInCopy: true },
    },
    body: {
      id: "body",
      role: "body",
      label: "Body",
      binding: { source: "block.content.body", required: true },
      copySafety: { copySafety: "balanced", allowedInCopy: true },
    },
    icon: presentationIcon(),
  };
}

export const INFO_CARD_EXPANSION_VARIANTS = [
  structuredExpansion({
    id: "info_card_method_steps",
    blockType: "info_card",
    family: "method",
    label: "Method Steps Info Card",
    slots: infoCardSlots(),
  }),
  structuredExpansion({
    id: "info_card_insight_band",
    blockType: "info_card",
    family: "insight",
    label: "Insight Band Info Card",
    slots: infoCardSlots(),
  }),
  structuredExpansion({
    id: "info_card_case_study",
    blockType: "info_card",
    family: "case",
    label: "Case Study Info Card",
    slots: infoCardSlots(),
  }),
  structuredExpansion({
    id: "info_card_checklist",
    blockType: "info_card",
    family: "checklist",
    label: "Checklist Info Card",
    slots: infoCardSlots(),
  }),
  structuredExpansion({
    id: "info_card_data_snapshot",
    blockType: "info_card",
    family: "data",
    label: "Data Snapshot Info Card",
    slots: infoCardSlots(),
  }),
  structuredExpansion({
    id: "info_card_soft_banner",
    blockType: "info_card",
    family: "banner",
    label: "Soft Banner Info Card",
    slots: infoCardSlots(),
  }),
] as const;

function ctaSlots(): Record<string, SlotDefinition> {
  return {
    action: {
      id: "action",
      role: "action",
      label: "Action",
      binding: { source: "block.content.action" },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
    body: bodyTextSlot("balanced"),
  };
}

export const CTA_EXPANSION_VARIANTS = [
  structuredExpansion({
    id: "cta_soft_banner",
    blockType: "cta",
    family: "soft",
    label: "Soft Banner CTA",
    slots: ctaSlots(),
  }),
  structuredExpansion({
    id: "cta_summary_band",
    blockType: "cta",
    family: "summary",
    label: "Summary Band CTA",
    slots: ctaSlots(),
  }),
  structuredExpansion({
    id: "cta_checklist_footer",
    blockType: "cta",
    family: "checklist",
    label: "Checklist Footer CTA",
    slots: ctaSlots(),
  }),
  structuredExpansion({
    id: "cta_dual_action",
    blockType: "cta",
    family: "dual",
    label: "Dual Action CTA",
    slots: ctaSlots(),
  }),
  structuredExpansion({
    id: "cta_minimal_link",
    blockType: "cta",
    family: "minimal",
    label: "Minimal Link CTA",
    copySafety: "strict",
    slots: ctaSlots(),
  }),
  structuredExpansion({
    id: "cta_card_promo",
    blockType: "cta",
    family: "promo",
    label: "Card Promo CTA",
    slots: ctaSlots(),
  }),
] as const;

function imageSlots(): Record<string, SlotDefinition> {
  return {
    image: {
      id: "image",
      role: "image",
      label: "Image",
      binding: { source: "disabled" },
      copySafety: { copySafety: "strict", allowedInCopy: false },
    },
    caption: {
      id: "caption",
      role: "body",
      label: "Caption",
      binding: { source: "block.content.caption" },
      copySafety: { copySafety: "balanced", allowedInCopy: true },
    },
  };
}

export const IMAGE_PLACEHOLDER_EXPANSION_VARIANTS = [
  structuredExpansion({
    id: "image_placeholder_full_bleed",
    blockType: "image_placeholder",
    family: "full",
    label: "Full Bleed Image Placeholder",
    slots: imageSlots(),
  }),
  structuredExpansion({
    id: "image_placeholder_minimal_frame",
    blockType: "image_placeholder",
    family: "minimal",
    label: "Minimal Frame Image Placeholder",
    slots: imageSlots(),
  }),
  structuredExpansion({
    id: "image_placeholder_polaroid",
    blockType: "image_placeholder",
    family: "polaroid",
    label: "Polaroid Image Placeholder",
    slots: imageSlots(),
  }),
  structuredExpansion({
    id: "image_placeholder_editorial",
    blockType: "image_placeholder",
    family: "editorial",
    label: "Editorial Image Placeholder",
    slots: imageSlots(),
  }),
  structuredExpansion({
    id: "image_placeholder_product",
    blockType: "image_placeholder",
    family: "product",
    label: "Product Image Placeholder",
    slots: imageSlots(),
  }),
  structuredExpansion({
    id: "image_placeholder_hero_band",
    blockType: "image_placeholder",
    family: "hero",
    label: "Hero Band Image Placeholder",
    slots: imageSlots(),
  }),
] as const;

export const EXPANSION_BLOCK_VARIANTS = [
  ...LEAD_EXPANSION_VARIANTS,
  ...PARAGRAPH_EXPANSION_VARIANTS,
  ...DIVIDER_EXPANSION_VARIANTS,
  ...LIST_EXPANSION_VARIANTS,
  ...QUOTE_EXPANSION_VARIANTS,
  ...HIGHLIGHT_EXPANSION_VARIANTS,
  ...INFO_CARD_EXPANSION_VARIANTS,
  ...CTA_EXPANSION_VARIANTS,
  ...IMAGE_PLACEHOLDER_EXPANSION_VARIANTS,
] as const;
