import { TITLE_BLOCK_FIRST_WAVE_VARIANTS } from "./title-heading";
import { TEXT_FIRST_BLOCK_VARIANTS } from "./text-first";
import { STRUCTURED_BLOCK_VARIANTS } from "./structured";
import { STYLE_SCHEMA_VERSION } from "../tokens";
import type { StyleRegistry } from "../types";

export {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  HEADING_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS,
  TITLE_FIRST_WAVE_VARIANTS,
  headingNumberedSection,
  headingPlainMinimal,
  headingTopBadgeTopic,
  titleBottomLineEditorial,
  titleLeftBarClassic,
  titlePlainMinimal,
} from "./title-heading";

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

export const FIRST_WAVE_REQUIRED_VARIANTS = [
  ...TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  ...TEXT_FIRST_BLOCK_VARIANTS,
  ...STRUCTURED_BLOCK_VARIANTS,
] as const;

export const FIRST_WAVE_REQUIRED_VARIANT_IDS =
  FIRST_WAVE_REQUIRED_VARIANTS.map((variant) => variant.id);

export const IMPLEMENTED_FIRST_WAVE_VARIANTS = FIRST_WAVE_REQUIRED_VARIANTS;

export const IMPLEMENTED_FIRST_WAVE_VARIANT_IDS =
  IMPLEMENTED_FIRST_WAVE_VARIANTS.map((variant) => variant.id);

export const FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK = {
  title: 3,
  lead: 3,
  heading: 3,
  paragraph: 3,
  divider: 3,
  list: 3,
  quote: 3,
  highlight: 3,
  info_card: 3,
  cta: 3,
  image_placeholder: 3,
} as const;

export function createFirstWaveRequiredVariantRegistry(): StyleRegistry {
  return {
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
          title: "title_plain_minimal",
          lead: "lead_plain_intro",
          heading: "heading_plain_minimal",
          paragraph: "paragraph_plain_body",
          divider: "divider_simple_line",
          list: "list_plain_bullets",
          quote: "quote_plain",
          highlight: "highlight_inline_emphasis",
          info_card: "info_card_key_takeaway",
          cta: "cta_plain_text",
          image_placeholder: "image_placeholder_simple",
        },
      },
    ],
    variants: [...FIRST_WAVE_REQUIRED_VARIANTS],
  };
}
