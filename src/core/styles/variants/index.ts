import { TITLE_BLOCK_FIRST_WAVE_VARIANTS } from "./title-heading";
import { TEXT_FIRST_BLOCK_VARIANTS } from "./text-first";

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

export const IMPLEMENTED_FIRST_WAVE_VARIANTS = [
  ...TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  ...TEXT_FIRST_BLOCK_VARIANTS,
] as const;

export const IMPLEMENTED_FIRST_WAVE_VARIANT_IDS =
  IMPLEMENTED_FIRST_WAVE_VARIANTS.map((variant) => variant.id);
