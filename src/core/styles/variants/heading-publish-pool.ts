/**
 * Release 1 heading publish pool — 8 miaopian-aligned styles (S7-STORY-008).
 * Single source for registry, preset pools, gallery, and preview heading picker.
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { CopySafety, TitleBlockLayoutMode, VariantDefinition } from "../types";

import {
  headingHighlightMarker,
  headingIconPrefix,
  headingMagazineLeftBar,
  headingMagazineOffset,
  headingMinimalNumber,
  headingShortLine,
} from "./miaopian-heading-variants";

function titleTextSlot(required = true) {
  return {
    id: "title",
    role: "title" as const,
    label: "Title",
    binding: { source: "block.content.text" as const, required },
    copySafety: { copySafety: "strict" as const, allowedInCopy: true },
  };
}

function presentationBadgeSlot() {
  return {
    id: "badge",
    role: "badge" as const,
    label: "Badge",
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
  };
}

function presentationIconSlot() {
  return {
    id: "icon",
    role: "icon" as const,
    label: "Icon",
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
  };
}

function presentationCornerSlot() {
  return {
    id: "corner",
    role: "decoration" as const,
    label: "Corner Accent",
    binding: { source: "variant.presentation" as const },
    copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
  };
}

function headingPublishVariant(config: {
  id: string;
  blockType: "heading";
  family: string;
  name: string;
  label: string;
  description?: string;
  layoutMode: TitleBlockLayoutMode;
  copySafety: CopySafety;
  slots: VariantDefinition["slots"];
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

/** 编号小节 */
export const headingNumberedSection = headingPublishVariant({
  id: "heading_numbered_section",
  blockType: "heading",
  family: "badgeTitle",
  name: "heading-numbered-section",
  label: "编号小节",
  description: "Accent index plate + section title",
  layoutMode: "numbered",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    badge: presentationBadgeSlot(),
  },
  tokens: {
    "typography.size": "17px",
    "spacing.block": "22px",
  },
});

/** 卡片居中 — 外层卡片 + 居中编号 + 标题（替代话题胶囊） */
export const headingCardCentered = headingPublishVariant({
  id: "heading_card_centered",
  blockType: "heading",
  family: "cardTitle",
  name: "heading-card-centered",
  label: "卡片居中",
  description: "Card frame with centered index and title",
  layoutMode: "card",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    badge: presentationBadgeSlot(),
  },
  tokens: {
    "typography.size": "17px",
    "spacing.block": "24px",
  },
});

export const HEADING_PUBLISH_VARIANT_IDS = [
  "heading_short_line",
  "heading_highlight_marker",
  "heading_icon_prefix",
  "heading_minimal_number",
  "heading_magazine_left_bar",
  "heading_magazine_offset",
  "heading_numbered_section",
  "heading_card_centered",
] as const;

export type HeadingPublishVariantId = (typeof HEADING_PUBLISH_VARIANT_IDS)[number];

export const HEADING_PUBLISH_VARIANTS = [
  headingShortLine,
  headingHighlightMarker,
  headingIconPrefix,
  headingMinimalNumber,
  headingMagazineLeftBar,
  headingMagazineOffset,
  headingNumberedSection,
  headingCardCentered,
] as const;

export const HEADING_PUBLISH_VARIANT_COUNT = HEADING_PUBLISH_VARIANTS.length;
