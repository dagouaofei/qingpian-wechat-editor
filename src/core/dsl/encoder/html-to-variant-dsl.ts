import { randomUUID } from "node:crypto";

import type { BlockType } from "@/core/blocks";
import { extractStyleFeaturesFromHtml } from "@/core/style-library/html-style-extractor";
import type { HarvestWechatCompatibilityMode } from "@/core/wechat-compatibility/harvest-compat-mode";

import {
  VARIANT_DSL_VERSION,
  type DslNode,
  type DslStyle,
  type VariantDslV1,
} from "../runtime/dsl-types";
import type { TraceLossReportItem } from "../runtime/dsl-trace-types";
import type { EncoderIssue, EncoderResult, HtmlToVariantDslInput } from "./encoder-types";
import { extractBorderedHeadingFromHtml } from "./bordered-heading-extractor";
import { buildFidelityTreeFromHtml } from "./fidelity-html-tree";
import { extractHeadingSemanticsMetadataOnly } from "./heading-semantic-extractor";

function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stylesFromFeatures(features: { key: string; value: string }[]): DslStyle {
  const style: DslStyle = {};
  for (const feature of features) {
    const key = feature.key.toLowerCase();
    if (key === "fontsize" || key === "font-size") style.fontSize = feature.value;
    if (key === "fontweight" || key === "font-weight") style.fontWeight = feature.value;
    if (key === "color") style.color = feature.value;
    if (key === "borderleft" || key === "border-left") style.borderLeft = feature.value;
    if (key === "padding") style.padding = feature.value;
    if (key === "paddingtop" || key === "padding-top") style.paddingTop = feature.value;
    if (key === "paddingbottom" || key === "padding-bottom") style.paddingBottom = feature.value;
    if (key === "backgroundcolor" || key === "background-color") style.backgroundColor = feature.value;
    if (key === "border") style.border = feature.value;
  }
  return style;
}

function buildInfoCardTree(cardStyle: DslStyle): DslNode {
  return {
    type: "element",
    tag: "section",
    style: {
      padding: "16px",
      backgroundColor: "#f7f8fa",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      ...cardStyle,
    },
    children: [
      { type: "slot", slot: "title", tag: "strong", style: { display: "block", marginBottom: "8px" } },
      { type: "slot", slot: "body", tag: "p", style: { margin: "0", lineHeight: "1.8" } },
    ],
  };
}

function buildGenericBlockTree(blockType: BlockType): DslNode {
  const slotName =
    blockType === "title" || blockType === "heading"
      ? "title"
      : blockType === "info_card"
        ? "body"
        : "text";

  return {
    type: "element",
    tag: "section",
    style: { margin: "16px 0" },
    children: [{ type: "slot", slot: slotName, tag: "p" }],
  };
}

export function encodeHtmlToVariantDsl(input: HtmlToVariantDslInput): EncoderResult<VariantDslV1> {
  const issues: EncoderIssue[] = [];
  const encoderLossReport: TraceLossReportItem[] = [];
  const compatibilityMode = input.wechatCompatibilityMode ?? "enforce";
  const workingHtml = input.html.trim();
  const traceId = randomUUID();

  const extraction = extractStyleFeaturesFromHtml(workingHtml);
  const featureStyle = stylesFromFeatures(extraction.features);
  issues.push(
    ...extraction.warnings.map((warning) => ({ code: "html_extraction_warning", message: warning })),
  );

  let tree: DslNode;
  let headingMeta: ReturnType<typeof extractHeadingSemanticsMetadataOnly> | undefined;
  let borderedHeading: ReturnType<typeof extractBorderedHeadingFromHtml> = null;

  if (input.blockType === "heading" || input.blockType === "title") {
    borderedHeading = extractBorderedHeadingFromHtml(workingHtml);
    if (borderedHeading) {
      tree = borderedHeading.tree;
      encoderLossReport.push(...borderedHeading.lossReport);
    } else {
      headingMeta = extractHeadingSemanticsMetadataOnly(workingHtml);
      tree = buildFidelityTreeFromHtml(workingHtml, headingMeta.slots);
    }
  } else if (input.blockType === "info_card") {
    tree = buildInfoCardTree(featureStyle);
  } else {
    tree = buildGenericBlockTree(input.blockType);
  }

  const slotBindings: VariantDslV1["slots"] = {
    title: { role: "title", required: input.blockType === "heading" || input.blockType === "title" },
    body: { role: "body" },
    text: { role: "text" },
  };

  if (headingMeta?.slots.eyebrow) {
    slotBindings.eyebrow = { role: "eyebrow" };
  }
  if (headingMeta?.slots.number) {
    slotBindings.number = { role: "number" };
  }
  if (headingMeta?.slots.subtitle) {
    slotBindings.subtitle = { role: "subtitle" };
  }

  const dsl: VariantDslV1 = {
    version: VARIANT_DSL_VERSION,
    id: input.runtimeVariantId,
    blockType: input.blockType,
    label: input.label,
    family: input.family ?? "htmlPaste",
    copySafety: input.copySafety ?? "strict",
    tree,
    tokens: headingMeta?.tokens,
    slots: slotBindings,
    meta: {
      encoderVersion: borderedHeading
        ? "s10_html_encoder_v4_fidelity_bordered"
        : "s10_html_encoder_v4_fidelity",
      traceId,
      compatibilityMode,
      extractedSlots: borderedHeading
        ? { title: borderedHeading.title }
        : headingMeta
          ? {
              ...(headingMeta.slots.eyebrow ? { eyebrow: headingMeta.slots.eyebrow } : {}),
              ...(headingMeta.slots.number ? { number: headingMeta.slots.number } : {}),
              title: headingMeta.slots.title,
              ...(headingMeta.slots.subtitle ? { subtitle: headingMeta.slots.subtitle } : {}),
            }
          : undefined,
      layoutIntent: borderedHeading?.layoutIntent ?? headingMeta?.layoutIntent,
      styleTokens: borderedHeading?.styleTokens,
      decorators: headingMeta?.decorators,
    },
  };

  const plainText =
    borderedHeading?.title ?? headingMeta?.slots.title ?? extractPlainText(workingHtml);
  const requiresTitleText = input.blockType === "heading" || input.blockType === "title";
  if (requiresTitleText && plainText.length === 0) {
    issues.push({
      code: "no_extractable_text",
      message: "No extractable heading text after sanitize — cannot build candidate DSL",
    });
    return { ok: false, issues };
  }

  if (input.blockType === "info_card" && plainText.length === 0) {
    issues.push({
      code: "no_extractable_text",
      message: "No extractable info_card body after sanitize — cannot build candidate DSL",
    });
    return { ok: false, issues };
  }

  return {
    ok: true,
    value: dsl,
    issues,
    sidecar: {
      traceId,
      encoderLossReport,
    },
  };
}
