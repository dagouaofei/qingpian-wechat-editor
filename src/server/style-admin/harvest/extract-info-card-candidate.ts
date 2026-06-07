import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";

import type { HtmlHarvestSourceInput } from "./html-harvest-types";
import { buildHtmlHarvestRuntimeVariantId } from "./normalize-html-for-hash";
import {
  extractFirstParagraphText,
  extractFirstStrongText,
  stripHtmlTags,
} from "./extract-text-from-html";
import { extractHarvestCandidateShared, type HarvestExtractResult } from "./extract-harvest-candidate-shared";

const HTML_PASTE_STYLE_FAMILY = "htmlPaste";

export function extractInfoCardCandidate(
  sanitizedHtml: string,
  source: HtmlHarvestSourceInput,
  selectedBlockType: "info_card",
): HarvestExtractResult {
  const title = extractFirstStrongText(sanitizedHtml) ?? source.sourceLabel.trim() ?? "Info Card";
  const body =
    extractFirstParagraphText(sanitizedHtml) ??
    (stripHtmlTags(sanitizedHtml).replace(title, "").trim() || "HTML paste info card body");
  const sampleText = `${title} — ${body}`.slice(0, 160);
  const runtimeVariantId = buildHtmlHarvestRuntimeVariantId("info_card", sanitizedHtml);
  const label = source.sourceLabel.trim() || title;

  return extractHarvestCandidateShared({
    sanitizedHtml,
    runtimeVariantId,
    blockType: selectedBlockType,
    label,
    description: `HTML harvest info card · ${source.sourceLabel}`,
    sampleText,
    styleFamily: HTML_PASTE_STYLE_FAMILY,
    componentProtocolJson: {
      familyId: HTML_PASTE_STYLE_FAMILY,
      layoutMode: "card",
      dslVersion: VARIANT_DSL_VERSION,
    },
  });
}
