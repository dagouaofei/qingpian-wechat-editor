import { detectHtmlBlockType } from "./detect-html-block-type";
import { extractHeadingCandidate } from "./extract-heading-candidate";
import { extractInfoCardCandidate } from "./extract-info-card-candidate";
import type {
  HtmlHarvestCandidateDraft,
  HtmlHarvestDetectableBlockType,
  HtmlHarvestDetectedBlockType,
  HtmlHarvestSourceInput,
} from "./html-harvest-types";
import { sanitizeHarvestHtml } from "./sanitize-harvest-html";

export function resolveSelectedBlockType(
  detectedBlockType: HtmlHarvestDetectedBlockType,
  manualBlockType?: HtmlHarvestDetectableBlockType,
): HtmlHarvestDetectableBlockType | null {
  if (manualBlockType) {
    return manualBlockType;
  }
  if (detectedBlockType === "heading" || detectedBlockType === "info_card") {
    return detectedBlockType;
  }
  return null;
}

export function buildCandidateVariantDraft(
  rawHtml: string,
  source: HtmlHarvestSourceInput,
  manualBlockType?: HtmlHarvestDetectableBlockType,
): { draft: HtmlHarvestCandidateDraft | null; detectedBlockType: HtmlHarvestDetectedBlockType } {
  const sanitizedHtml = sanitizeHarvestHtml(rawHtml);
  const detectedBlockType = detectHtmlBlockType(sanitizedHtml);
  const selectedBlockType = resolveSelectedBlockType(detectedBlockType, manualBlockType);

  if (!selectedBlockType) {
    return { draft: null, detectedBlockType };
  }

  const extracted =
    selectedBlockType === "heading"
      ? extractHeadingCandidate(sanitizedHtml, source, selectedBlockType)
      : extractInfoCardCandidate(sanitizedHtml, source, selectedBlockType);

  return {
    detectedBlockType,
    draft: {
      ...extracted,
      detectedBlockType,
      selectedBlockType,
      sanitizedHtml,
      rawHtmlLength: rawHtml.length,
    },
  };
}
