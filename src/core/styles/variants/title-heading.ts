/**
 * Sprint 3-B first-wave titleBlock variants — title × 3 + heading × 3
 * @see docs/architecture/style-system.md §11.4
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { CopySafety, TitleBlockLayoutMode, VariantDefinition } from "../types";

function titleBlockVariant(
  config: {
    id: string;
    blockType: "title" | "heading";
    family: string;
    name: string;
    label: string;
    description?: string;
    layoutMode: TitleBlockLayoutMode;
    copySafety: CopySafety;
    slots: VariantDefinition["slots"];
    tokens?: VariantDefinition["tokens"];
  },
): VariantDefinition {
  return {
    id: config.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: config.blockType,
    family: config.family,
    name: config.name,
    label: config.label,
    description: config.description,
    status: "release1_required",
    componentProtocol: {
      componentId: TITLE_BLOCK_COMPONENT_ID,
      familyId: config.family,
      layoutMode: config.layoutMode,
    },
    compatibility: {
      copySafety: config.copySafety,
    },
    slots: config.slots,
    tokens: config.tokens,
  };
}

function titleTextSlot(required = true) {
  return {
    id: "title",
    role: "title" as const,
    label: "Title",
    binding: { source: "block.content.text" as const, required },
    copySafety: { copySafety: "strict" as const, allowedInCopy: true },
  };
}

function presentationDecorationSlot(id = "decoration") {
  return {
    id,
    role: "decoration" as const,
    label: "Decoration",
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
  };
}

function presentationBadgeSlot(id = "badge") {
  return {
    id,
    role: "badge" as const,
    label: "Badge",
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
  };
}

export const titlePlainMinimal: VariantDefinition = titleBlockVariant({
  id: "title_plain_minimal",
  blockType: "title",
  family: "simple",
  name: "title-plain-minimal",
  label: "Plain Minimal Title",
  description: "First-wave plain titleBlock with text-only layout",
  layoutMode: "plain",
  copySafety: "strict",
  slots: {
    title: titleTextSlot(),
  },
  tokens: {
    "typography.weight": "bold",
    "spacing.block": "24px",
  },
});

export const titleLeftBarClassic: VariantDefinition = titleBlockVariant({
  id: "title_left_bar_classic",
  blockType: "title",
  family: "simple",
  name: "title-left-bar-classic",
  label: "Left Bar Classic Title",
  description: "First-wave left bar titleBlock for editorial section openers",
  layoutMode: "left_bar",
  copySafety: "strict",
  slots: {
    title: titleTextSlot(),
    decoration: presentationDecorationSlot(),
  },
});

export const titleBottomLineEditorial: VariantDefinition = titleBlockVariant({
  id: "title_bottom_line_editorial",
  blockType: "title",
  family: "simple",
  name: "title-bottom-line-editorial",
  label: "Bottom Line Editorial Title",
  description: "First-wave bottom line titleBlock aligned with catalog title_with_bottom_line",
  layoutMode: "bottom_line",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    divider: {
      id: "divider",
      role: "divider" as const,
      label: "Bottom Line",
      binding: { source: "variant.presentation" as const },
      copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
    },
  },
});

export const headingPlainMinimal: VariantDefinition = titleBlockVariant({
  id: "heading_plain_minimal",
  blockType: "heading",
  family: "simple",
  name: "heading-plain-minimal",
  label: "Plain Minimal Heading",
  description: "First-wave plain heading titleBlock",
  layoutMode: "plain",
  copySafety: "strict",
  slots: {
    title: titleTextSlot(),
  },
});

export const headingNumberedSection: VariantDefinition = titleBlockVariant({
  id: "heading_numbered_section",
  blockType: "heading",
  family: "badgeTitle",
  name: "heading-numbered-section",
  label: "Numbered Section Heading",
  description: "First-wave numbered heading with presentation badge",
  layoutMode: "numbered",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    badge: presentationBadgeSlot(),
  },
});

export const headingTopBadgeTopic: VariantDefinition = titleBlockVariant({
  id: "heading_top_badge_topic",
  blockType: "heading",
  family: "badgeTitle",
  name: "heading-top-badge-topic",
  label: "Top Badge Topic Heading",
  description: "First-wave top badge heading for topic emphasis",
  layoutMode: "top_badge",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    badge: presentationBadgeSlot(),
  },
});

export const TITLE_FIRST_WAVE_VARIANTS = [
  titlePlainMinimal,
  titleLeftBarClassic,
  titleBottomLineEditorial,
] as const;

export const HEADING_FIRST_WAVE_VARIANTS = [
  headingPlainMinimal,
  headingNumberedSection,
  headingTopBadgeTopic,
] as const;

export const TITLE_BLOCK_FIRST_WAVE_VARIANTS = [
  ...TITLE_FIRST_WAVE_VARIANTS,
  ...HEADING_FIRST_WAVE_VARIANTS,
] as const;

export const TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS = TITLE_BLOCK_FIRST_WAVE_VARIANTS.map(
  (variant) => variant.id,
);

/** Partial registry fixture — title / heading first-wave only (not full 33 variants) */
export const FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "default",
      name: "Default Theme",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: { "text.default": "#333333" },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "classic-news",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "default",
      defaultVariantByBlockType: {
        title: titlePlainMinimal.id,
        heading: headingPlainMinimal.id,
      },
    },
  ],
  variants: [...TITLE_BLOCK_FIRST_WAVE_VARIANTS],
};
