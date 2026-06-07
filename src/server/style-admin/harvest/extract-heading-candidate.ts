import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";

import type { HtmlHarvestSourceInput } from "./html-harvest-types";
import { buildHtmlHarvestRuntimeVariantId } from "./normalize-html-for-hash";
import { stripHtmlTags } from "./extract-text-from-html";
import { extractHarvestCandidateShared, type HarvestExtractResult } from "./extract-harvest-candidate-shared";

const HTML_PASTE_STYLE_FAMILY = "htmlPaste";

export function extractHeadingCandidate(
  sanitizedHtml: string,
  source: HtmlHarvestSourceInput,
  selectedBlockType: "heading",
): HarvestExtractResult {
  const sampleText = stripHtmlTags(sanitizedHtml) || source.sourceLabel;
  const runtimeVariantId = buildHtmlHarvestRuntimeVariantId("heading", sanitizedHtml);
  const label = source.sourceLabel.trim() || sampleText.slice(0, 60) || "HTML Paste Heading";

  return extractHarvestCandidateShared({
    sanitizedHtml,
    runtimeVariantId,
    blockType: selectedBlockType,
    label,
    description: `HTML harvest heading · ${source.sourceLabel}`,
    sampleText,
    styleFamily: HTML_PASTE_STYLE_FAMILY,
    componentProtocolJson: {
      componentId: TITLE_BLOCK_COMPONENT_ID,
      familyId: HTML_PASTE_STYLE_FAMILY,
      layoutMode: "pill",
      dslVersion: VARIANT_DSL_VERSION,
    },
  });
}
