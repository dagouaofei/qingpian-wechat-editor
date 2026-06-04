/**
 * Miaopian-demo aligned heading variants (titleBlock pool).
 * @see miaopian-demo/config/themePresets.ts TITLE_VARIANT_LABELS
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { CopySafety, SlotDefinition, TitleBlockLayoutMode, VariantDefinition } from "../types";

function titleTextSlot(): SlotDefinition {
  return {
    id: "title",
    role: "title",
    label: "Title",
    binding: { source: "block.content.text", required: true },
    copySafety: { copySafety: "strict", allowedInCopy: true },
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

function presentationBadge(): SlotDefinition {
  return {
    id: "badge",
    role: "badge",
    label: "Badge",
    binding: { source: "variant.presentation" },
    copySafety: { copySafety: "balanced", allowedInCopy: true },
  };
}

function miaopianHeadingVariant(config: {
  id: string;
  label: string;
  family: string;
  layoutMode: TitleBlockLayoutMode;
  slots?: VariantDefinition["slots"];
}): VariantDefinition {
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
    tokens: { "typography.size": "17px", "spacing.block": "22px" },
  };
}

/** 荧光笔标题 — highlight_marker_title */
export const headingHighlightMarker = miaopianHeadingVariant({
  id: "heading_highlight_marker",
  label: "荧光笔标题",
  family: "badgeTitle",
  layoutMode: "highlight_marker",
});

/** 短线标题 — title_with_bottom_line */
export const headingShortLine = miaopianHeadingVariant({
  id: "heading_short_line",
  label: "短线标题",
  family: "simple",
  layoutMode: "short_line",
});

/** 图标前缀标题 — icon_inline_prefix_title */
export const headingIconPrefix = miaopianHeadingVariant({
  id: "heading_icon_prefix",
  label: "图标前缀标题",
  family: "iconDecor",
  layoutMode: "icon_prefix",
  slots: { title: titleTextSlot(), decoration: presentationDecoration() },
});

/** 极简数字标题 — minimal_number_title */
export const headingMinimalNumber = miaopianHeadingVariant({
  id: "heading_minimal_number",
  label: "极简数字标题",
  family: "simple",
  layoutMode: "minimal_number",
  slots: { title: titleTextSlot(), badge: presentationBadge() },
});

/** 杂志竖线标题 — magazine_left_bar_title */
export const headingMagazineLeftBar = miaopianHeadingVariant({
  id: "heading_magazine_left_bar",
  label: "杂志竖线标题",
  family: "magazine",
  layoutMode: "magazine_left_bar",
  slots: { title: titleTextSlot(), badge: presentationBadge() },
});

/** 杂志错位标题 — magazine_offset_title */
export const headingMagazineOffset = miaopianHeadingVariant({
  id: "heading_magazine_offset",
  label: "杂志错位标题",
  family: "magazine",
  layoutMode: "magazine_offset",
});

export const MIAOPIAN_HEADING_VARIANTS = [
  headingHighlightMarker,
  headingShortLine,
  headingIconPrefix,
  headingMinimalNumber,
  headingMagazineLeftBar,
  headingMagazineOffset,
] as const;
