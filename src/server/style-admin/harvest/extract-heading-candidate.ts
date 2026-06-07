import { extractStyleFeaturesFromHtml } from "@/core/style-library/html-style-extractor";
import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";

import type { HtmlHarvestCandidateDraft, HtmlHarvestSourceInput } from "./html-harvest-types";
import { buildHtmlHarvestRuntimeVariantId } from "./normalize-html-for-hash";
import { stableJsonChecksum } from "../import/checksum";
import { stripHtmlTags } from "./extract-text-from-html";

const HTML_PASTE_STYLE_FAMILY = "htmlPaste";

function buildHeadingTokens(features: { key: string; value: string }[]): Record<string, string> {
  const tokens: Record<string, string> = {
    "spacing.block": "16px",
  };
  for (const feature of features) {
    const key = feature.key.toLowerCase();
    if (key === "fontsize" || key === "font-size") {
      tokens["typography.size"] = feature.value;
    }
    if (key === "fontweight" || key === "font-weight") {
      tokens["typography.weight"] = feature.value;
    }
    if (key === "color") {
      tokens["color.text"] = feature.value;
    }
    if (key === "borderleft" || key === "border-left") {
      tokens["border.left"] = feature.value;
    }
  }
  return tokens;
}

export function extractHeadingCandidate(
  sanitizedHtml: string,
  source: HtmlHarvestSourceInput,
  selectedBlockType: "heading",
): Omit<
  HtmlHarvestCandidateDraft,
  "sanitizedHtml" | "rawHtmlLength" | "detectedBlockType" | "selectedBlockType"
> {
  const extraction = extractStyleFeaturesFromHtml(sanitizedHtml);
  const sampleText = stripHtmlTags(sanitizedHtml) || source.sourceLabel;
  const runtimeVariantId = buildHtmlHarvestRuntimeVariantId("heading", sanitizedHtml);
  const label = source.sourceLabel.trim() || sampleText.slice(0, 60) || "HTML Paste Heading";
  const name = runtimeVariantId.replace(/_candidate$/, "");

  const definitionJson = {
    id: runtimeVariantId,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: "heading",
    family: HTML_PASTE_STYLE_FAMILY,
    name,
    label,
    description: `HTML harvest heading · ${source.sourceLabel}`,
    status: "experimental",
    slots: {
      title: {
        id: "title",
        role: "title",
        label: "Title",
        binding: { source: "block.content.text", required: true },
        copySafety: { copySafety: "strict", allowedInCopy: true },
      },
    },
    tokens: buildHeadingTokens(extraction.features),
    harvestMeta: {
      sampleText,
      parserVersion: "s10_html_harvest_v1",
      extractionWarnings: extraction.warnings,
    },
  };

  const componentProtocolJson = {
    componentId: TITLE_BLOCK_COMPONENT_ID,
    familyId: HTML_PASTE_STYLE_FAMILY,
    layoutMode: "pill",
  };

  const compatibilityJson = {
    copySafety: "strict",
  };

  const sourceChecksum = stableJsonChecksum({
    definition: definitionJson,
    componentProtocol: componentProtocolJson,
    compatibility: compatibilityJson,
    sanitizedHtml,
  });

  return {
    runtimeVariantId,
    blockType: selectedBlockType,
    styleFamily: HTML_PASTE_STYLE_FAMILY,
    label,
    description: definitionJson.description,
    sampleText,
    definitionJson,
    componentProtocolJson,
    compatibilityJson,
    copySafety: "strict",
    sourceChecksum,
  };
}
