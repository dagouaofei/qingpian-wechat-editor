import type { BlockType } from "@/core/blocks";
import { extractStyleFeaturesFromHtml } from "@/core/style-library/html-style-extractor";
import { TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";
import { normalizeAndValidateWechatHtml } from "@/core/wechat-compatibility";

import {
  VARIANT_DSL_VERSION,
  type DslNode,
  type DslStyle,
  type VariantDslV1,
} from "../runtime/dsl-types";
import type { EncoderIssue, EncoderResult, HtmlToVariantDslInput } from "./encoder-types";
import { buildHtmlEncoderTrace, mergeLossReports } from "./encoder-trace";
import {
  buildSemanticHeadingTree,
  extractHeadingSemanticsFromHtml,
} from "./heading-semantic-extractor";

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

function buildSimpleHeadingTree(sectionStyle: DslStyle, titleStyle: DslStyle): DslNode {
  return {
    type: "element",
    tag: "section",
    style: sectionStyle,
    children: [
      {
        type: "slot",
        slot: "title",
        tag: "span",
        style: {
          fontSize: "18px",
          fontWeight: 700,
          color: "#111111",
          display: "block",
          lineHeight: "1.5",
          ...titleStyle,
        },
      },
    ],
  };
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
  const { transform, validation } = normalizeAndValidateWechatHtml(input.html);

  for (const issue of validation.issues) {
    issues.push({
      code: issue.code,
      message: issue.message,
    });
  }
  for (const loss of transform.issues) {
    issues.push({ code: "sanitize_transform", message: loss });
  }
  for (const downgraded of transform.downgraded) {
    issues.push({ code: "style_downgraded", message: `Downgraded incompatible element: ${downgraded}` });
  }

  const extraction = extractStyleFeaturesFromHtml(transform.html);
  const featureStyle = stylesFromFeatures(extraction.features);
  issues.push(
    ...extraction.warnings.map((warning) => ({ code: "html_extraction_warning", message: warning })),
  );

  let tree: DslNode;
  let headingSemantic:
    | ReturnType<typeof extractHeadingSemanticsFromHtml>
    | undefined;

  if (input.blockType === "heading" || input.blockType === "title") {
    headingSemantic = extractHeadingSemanticsFromHtml(input.html);
    for (const loss of headingSemantic.lossReport) {
      issues.push({ code: loss.code, message: loss.message });
    }

    const isComplex =
      headingSemantic.layoutIntent === "chapter_overlay_heading" ||
      Boolean(headingSemantic.slots.eyebrow || headingSemantic.slots.number);

    if (isComplex && headingSemantic.slots.title) {
      tree = buildSemanticHeadingTree(headingSemantic);
    } else {
      const sectionStyle: DslStyle = {
        paddingTop: "8px",
        paddingBottom: "8px",
      };
      if (featureStyle.borderLeft) {
        sectionStyle.borderLeft = String(featureStyle.borderLeft);
      } else {
        sectionStyle.borderLeftWidth = "4px";
        sectionStyle.borderLeftStyle = "solid";
        sectionStyle.borderLeftColor = "#1677ff";
      }
      if (featureStyle.paddingTop) sectionStyle.paddingTop = String(featureStyle.paddingTop);
      if (featureStyle.paddingBottom) sectionStyle.paddingBottom = String(featureStyle.paddingBottom);
      if (featureStyle.padding) sectionStyle.padding = String(featureStyle.padding);
      tree = buildSimpleHeadingTree(sectionStyle, featureStyle);
    }
  } else if (input.blockType === "info_card") {
    tree = buildInfoCardTree(featureStyle);
  } else {
    tree = buildGenericBlockTree(input.blockType);
  }

  const encoderTrace = headingSemantic
    ? buildHtmlEncoderTrace(headingSemantic, issues)
    : undefined;

  const slotBindings: VariantDslV1["slots"] = {
    title: { role: "title", required: input.blockType === "heading" || input.blockType === "title" },
    body: { role: "body" },
    text: { role: "text" },
  };

  if (headingSemantic?.slots.eyebrow) {
    slotBindings.eyebrow = { role: "eyebrow" };
  }
  if (headingSemantic?.slots.number) {
    slotBindings.number = { role: "number" };
  }
  if (headingSemantic?.slots.subtitle) {
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
    tokens: headingSemantic?.tokens,
    slots: slotBindings,
    componentProtocol:
      input.blockType === "heading" || input.blockType === "title"
        ? { componentId: TITLE_BLOCK_COMPONENT_ID, layoutMode: "pill" }
        : undefined,
    meta: {
      source: "html_encoder",
      sanitizedHtmlLength: transform.html.length,
      encoderVersion: "s10_html_encoder_v2_semantic",
      extractedSlots: headingSemantic
        ? {
            ...(headingSemantic.slots.eyebrow ? { eyebrow: headingSemantic.slots.eyebrow } : {}),
            ...(headingSemantic.slots.number ? { number: headingSemantic.slots.number } : {}),
            title: headingSemantic.slots.title,
            ...(headingSemantic.slots.subtitle ? { subtitle: headingSemantic.slots.subtitle } : {}),
          }
        : undefined,
      layoutIntent: headingSemantic?.layoutIntent,
      decorators: headingSemantic?.decorators,
      encoderTrace,
      lossReport: headingSemantic
        ? mergeLossReports(headingSemantic.lossReport)
        : undefined,
    },
  };

  const plainText = headingSemantic?.slots.title || extractPlainText(transform.html);
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
    value: {
      ...dsl,
      meta: {
        ...dsl.meta,
        compatibilityValid: validation.valid,
        compatibilityIssueCount: validation.issues.length,
      },
    },
    issues,
  };
}
