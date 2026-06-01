import { TITLE_BLOCK_FIRST_WAVE_VARIANTS } from "./title-heading";
import { TEXT_FIRST_BLOCK_VARIANTS } from "./text-first";
import { STRUCTURED_BLOCK_VARIANTS } from "./structured";

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
