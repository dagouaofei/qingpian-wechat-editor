import type { HighlightBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type HighlightLayoutKind = "inline_emphasis" | "accent_band" | "soft_card";

export type NormalizedHighlightContent = {
  text: string;
  label?: string;
};

export type HighlightTypography = {
  color: string;
  mutedColor: string;
  accentColor: string;
  fontSize: string;
  labelFontSize: string;
  lineHeight: string;
  marginBlock: string;
};

const VARIANT_LAYOUT_MAP: Record<string, HighlightLayoutKind> = {
  highlight_inline_emphasis: "inline_emphasis",
  highlight_accent_band: "accent_band",
  highlight_soft_card: "soft_card",
};

export function resolveHighlightLayout(
  variantId: string,
): HighlightLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
}

export function resolveHighlightTypography(
  resolved: ResolvedBlockStyleView,
): HighlightTypography {
  const themeColor = resolved.tokens.theme.color?.["text.default"] ?? "#333333";
  const accentColor =
    resolved.tokens.theme.color?.["text.accent"] ??
    resolved.tokens.theme.color?.["brand.primary"] ??
    "#576b95";
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    color: themeColor,
    mutedColor: "#666666",
    accentColor,
    fontSize: bodyFontSize,
    labelFontSize: "13px",
    lineHeight: "1.75",
    marginBlock: variantSpacing ?? "16px",
  };
}

export function resolveHighlightCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

export function normalizeHighlightContentForRenderer(
  block: HighlightBlock,
  variantId: string,
): { content?: NormalizedHighlightContent; issues: RendererIssue[] } {
  const issues: RendererIssue[] = [];
  const rawText = (block.content as { text?: unknown }).text;

  if (typeof rawText !== "string" || rawText.trim() === "") {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "highlight renderer requires non-empty content.text",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "text"],
      }),
    );
    return { issues };
  }

  const rawLabel = (block.content as { label?: unknown }).label;
  let label: string | undefined;

  if (rawLabel == null || rawLabel === "") {
    issues.push(
      createRendererIssue({
        code: "optional_slot_disabled",
        message: "highlight label is absent and will not be rendered",
        severity: "info",
        blockId: block.id,
        blockType: block.type,
        variantId,
        slotId: "label",
        path: ["block", "content", "label"],
      }),
    );
  } else if (typeof rawLabel === "string") {
    label = rawLabel.trim();
  } else {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "highlight label must be a string when present",
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "label"],
      }),
    );
  }

  return {
    content: {
      text: rawText.trim(),
      label: label === "" ? undefined : label,
    },
    issues,
  };
}
