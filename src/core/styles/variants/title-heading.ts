/**
 * Sprint 3-B first-wave titleBlock variants — title × 3 + heading × 3
 * @see docs/architecture/style-system.md §11.4
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { CopySafety, TitleBlockLayoutMode, VariantDefinition } from "../types";

import { HEADING_PUBLISH_VARIANTS } from "./heading-publish-pool";

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

export const titlePlainMinimal: VariantDefinition = titleBlockVariant({
  id: "title_plain_minimal",
  blockType: "title",
  family: "cardTitle",
  name: "title-plain-minimal",
  label: "Plain Minimal Title",
  description: "cardTitle frame with star icon capsule",
  layoutMode: "plain",
  copySafety: "strict",
  slots: {
    title: titleTextSlot(),
    icon: presentationIconSlot(),
    corner: presentationCornerSlot(),
  },
  tokens: {
    "typography.weight": "bold",
    "typography.size": "26px",
    "spacing.block": "32px",
  },
});

export const titleLeftBarClassic: VariantDefinition = titleBlockVariant({
  id: "title_left_bar_classic",
  blockType: "title",
  family: "iconDecor",
  name: "title-left-bar-classic",
  label: "Left Bar Classic Title",
  description: "iconDecor left bar with quote icon capsule",
  layoutMode: "left_bar",
  copySafety: "strict",
  slots: {
    title: titleTextSlot(),
    icon: presentationIconSlot(),
    decoration: presentationDecorationSlot(),
  },
  tokens: {
    "typography.size": "26px",
    "spacing.block": "32px",
  },
});

export const titleBottomLineEditorial: VariantDefinition = titleBlockVariant({
  id: "title_bottom_line_editorial",
  blockType: "title",
  family: "iconDecor",
  name: "title-bottom-line-editorial",
  label: "Bottom Line Editorial Title",
  description: "iconDecor center title with star flanked ornament",
  layoutMode: "bottom_line",
  copySafety: "balanced",
  slots: {
    title: titleTextSlot(),
    icon: presentationIconSlot(),
    divider: {
      id: "divider",
      role: "divider" as const,
      label: "Bottom Line",
      binding: { source: "variant.presentation" as const },
      copySafety: { copySafety: "balanced" as const, allowedInCopy: true },
    },
  },
  tokens: {
    "typography.size": "28px",
    "spacing.block": "36px",
  },
});

export {
  HEADING_PUBLISH_VARIANT_IDS,
  HEADING_PUBLISH_VARIANT_COUNT,
  headingNumberedSection,
  headingCardCentered,
  type HeadingPublishVariantId,
} from "./heading-publish-pool";

export { HEADING_PUBLISH_VARIANTS };

export const TITLE_FIRST_WAVE_VARIANTS = [
  titlePlainMinimal,
  titleLeftBarClassic,
  titleBottomLineEditorial,
] as const;

export const HEADING_FIRST_WAVE_VARIANTS = HEADING_PUBLISH_VARIANTS;

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
      name: "Business",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        title: titlePlainMinimal.id,
        heading: "heading_short_line",
      },
    },
  ],
  variants: [...TITLE_BLOCK_FIRST_WAVE_VARIANTS],
};
