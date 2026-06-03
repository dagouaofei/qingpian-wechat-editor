import {
  buildMiaopianPresetDefinitions,
  MIAOPIAN_THEME_DEFINITIONS,
} from "@/config/miaopian-preset-bundles";

import { EXPANSION_BLOCK_VARIANTS } from "./expansion-blocks";
import { TITLE_BLOCK_FIRST_WAVE_VARIANTS } from "./title-heading";
import { TEXT_FIRST_BLOCK_VARIANTS } from "./text-first";
import { STRUCTURED_BLOCK_VARIANTS } from "./structured";
import { STYLE_SCHEMA_VERSION } from "../tokens";
import type { BlockType } from "@/core/blocks";
import type { StyleRegistry } from "../types";

export {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  HEADING_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS,
  TITLE_FIRST_WAVE_VARIANTS,
  headingNumberedSection,
  headingCardCentered,
  titleBottomLineEditorial,
  titleLeftBarClassic,
  titlePlainMinimal,
} from "./title-heading";

export {
  HEADING_PUBLISH_VARIANT_COUNT,
  HEADING_PUBLISH_VARIANT_IDS,
  HEADING_PUBLISH_VARIANTS,
  type HeadingPublishVariantId,
} from "./heading-publish-pool";

export {
  DIVIDER_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  TEXT_FIRST_BLOCK_VARIANT_IDS,
  TEXT_FIRST_BLOCK_VARIANT_REGISTRY,
  TEXT_FIRST_BLOCK_VARIANTS,
  dividerDottedLine,
  dividerSectionSpace,
  dividerSimpleLine,
  leadAccentBand,
  leadPlainIntro,
  leadQuoteIntro,
  listChecklistCards,
  listNumberedSteps,
  listPlainBullets,
  paragraphAccentLeft,
  paragraphPlainBody,
  paragraphSoftCard,
} from "./text-first";

export {
  CTA_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STRUCTURED_BLOCK_VARIANT_IDS,
  STRUCTURED_BLOCK_VARIANT_REGISTRY,
  STRUCTURED_BLOCK_VARIANTS,
  ctaButtonLike,
  ctaPlainText,
  ctaQrPlaceholder,
  highlightAccentBand,
  highlightInlineEmphasis,
  highlightSoftCard,
  imagePlaceholderCaption,
  imagePlaceholderCard,
  imagePlaceholderSimple,
  infoCardKeyTakeaway,
  infoCardSteps,
  infoCardWarningNote,
  quoteCard,
  quoteLeftBar,
  quotePlain,
} from "./structured";

export {
  EXPANSION_BLOCK_VARIANTS,
  LEAD_EXPANSION_VARIANTS,
  PARAGRAPH_EXPANSION_VARIANTS,
  DIVIDER_EXPANSION_VARIANTS,
  LIST_EXPANSION_VARIANTS,
  QUOTE_EXPANSION_VARIANTS,
  HIGHLIGHT_EXPANSION_VARIANTS,
  INFO_CARD_EXPANSION_VARIANTS,
  CTA_EXPANSION_VARIANTS,
  IMAGE_PLACEHOLDER_EXPANSION_VARIANTS,
} from "./expansion-blocks";

/** @deprecated Use RELEASE1_REQUIRED_VARIANTS — kept for import compatibility */
export const FIRST_WAVE_REQUIRED_VARIANTS = [
  ...TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  ...TEXT_FIRST_BLOCK_VARIANTS,
  ...STRUCTURED_BLOCK_VARIANTS,
  ...EXPANSION_BLOCK_VARIANTS,
] as const;

export const RELEASE1_REQUIRED_VARIANTS = FIRST_WAVE_REQUIRED_VARIANTS;

export const FIRST_WAVE_REQUIRED_VARIANT_IDS =
  FIRST_WAVE_REQUIRED_VARIANTS.map((variant) => variant.id);

export const RELEASE1_REQUIRED_VARIANT_IDS = FIRST_WAVE_REQUIRED_VARIANT_IDS;

export const IMPLEMENTED_FIRST_WAVE_VARIANTS = FIRST_WAVE_REQUIRED_VARIANTS;

export const IMPLEMENTED_FIRST_WAVE_VARIANT_IDS =
  IMPLEMENTED_FIRST_WAVE_VARIANTS.map((variant) => variant.id);

export const FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK = {
  title: 3,
  lead: 9,
  heading: 8,
  paragraph: 9,
  divider: 9,
  list: 9,
  quote: 9,
  highlight: 9,
  info_card: 9,
  cta: 9,
  image_placeholder: 9,
} as const;

export const RELEASE1_REQUIRED_VARIANT_COUNT_BY_BLOCK =
  FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK;

export function variantIdsForBlockType(blockType: BlockType): string[] {
  return FIRST_WAVE_REQUIRED_VARIANTS.filter((v) => v.blockType === blockType).map(
    (v) => v.id,
  );
}

export function createFirstWaveRequiredVariantRegistry(): StyleRegistry {
  return {
    schemaVersion: STYLE_SCHEMA_VERSION,
    themes: MIAOPIAN_THEME_DEFINITIONS,
    presets: buildMiaopianPresetDefinitions(),
    variants: [...FIRST_WAVE_REQUIRED_VARIANTS],
  };
}
