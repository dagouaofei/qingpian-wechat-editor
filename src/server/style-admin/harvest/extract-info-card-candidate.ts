import { extractStyleFeaturesFromHtml } from "@/core/style-library/html-style-extractor";
import { STYLE_SCHEMA_VERSION } from "@/core/styles/types";

import type { HtmlHarvestCandidateDraft, HtmlHarvestSourceInput } from "./html-harvest-types";
import { buildHtmlHarvestRuntimeVariantId } from "./normalize-html-for-hash";
import { stableJsonChecksum } from "../import/checksum";
import {
  extractFirstParagraphText,
  extractFirstStrongText,
  stripHtmlTags,
} from "./extract-text-from-html";

const HTML_PASTE_STYLE_FAMILY = "htmlPaste";

function buildInfoCardTokens(features: { key: string; value: string }[]): Record<string, string> {
  const tokens: Record<string, string> = {
    "spacing.block": "16px",
  };
  for (const feature of features) {
    const key = feature.key.toLowerCase();
    if (key === "background" || key === "backgroundcolor") {
      tokens["surface.background"] = feature.value;
    }
    if (key === "border") {
      tokens["border.all"] = feature.value;
    }
    if (key === "padding") {
      tokens["spacing.inner"] = feature.value;
    }
    if (key === "borderradius" || key === "border-radius") {
      tokens["radius.card"] = feature.value;
    }
  }
  return tokens;
}

export function extractInfoCardCandidate(
  sanitizedHtml: string,
  source: HtmlHarvestSourceInput,
  selectedBlockType: "info_card",
): Omit<
  HtmlHarvestCandidateDraft,
  "sanitizedHtml" | "rawHtmlLength" | "detectedBlockType" | "selectedBlockType"
> {
  const extraction = extractStyleFeaturesFromHtml(sanitizedHtml);
  const title = extractFirstStrongText(sanitizedHtml) ?? source.sourceLabel.trim() ?? "Info Card";
  const body =
    extractFirstParagraphText(sanitizedHtml) ??
    (stripHtmlTags(sanitizedHtml).replace(title, "").trim() ||
      "HTML paste info card body");
  const sampleText = `${title} — ${body}`.slice(0, 160);
  const runtimeVariantId = buildHtmlHarvestRuntimeVariantId("info_card", sanitizedHtml);
  const label = source.sourceLabel.trim() || title;
  const name = runtimeVariantId.replace(/_candidate$/, "");

  const definitionJson = {
    id: runtimeVariantId,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: "info_card",
    family: HTML_PASTE_STYLE_FAMILY,
    name,
    label,
    description: `HTML harvest info card · ${source.sourceLabel}`,
    status: "experimental",
    slots: {
      title: {
        id: "title",
        role: "title",
        label: "Title",
        binding: { source: "block.content.title" },
        copySafety: { copySafety: "strict", allowedInCopy: true },
      },
      body: {
        id: "body",
        role: "body",
        label: "Body",
        binding: { source: "block.content.body", required: true },
        copySafety: { copySafety: "strict", allowedInCopy: true },
      },
    },
    tokens: buildInfoCardTokens(extraction.features),
    harvestMeta: {
      title,
      body,
      sampleText,
      parserVersion: "s10_html_harvest_v1",
      extractionWarnings: extraction.warnings,
    },
  };

  const componentProtocolJson = {
    familyId: HTML_PASTE_STYLE_FAMILY,
    layoutMode: "card",
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
