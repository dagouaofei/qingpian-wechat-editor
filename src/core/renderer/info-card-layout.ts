import type { InfoCardBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type InfoCardLayoutKind = "key_takeaway" | "steps" | "warning_note";

export type NormalizedInfoCardContent = {
  title?: string;
  body: string;
  icon?: string;
  bodyLines: string[];
};

export type InfoCardTypography = {
  color: string;
  mutedColor: string;
  accentColor: string;
  warningColor: string;
  fontSize: string;
  titleFontSize: string;
  auxFontSize: string;
  lineHeight: string;
  marginBlock: string;
};

const VARIANT_LAYOUT_MAP: Record<string, InfoCardLayoutKind> = {
  info_card_key_takeaway: "key_takeaway",
  info_card_steps: "steps",
  info_card_warning_note: "warning_note",
};

export function resolveInfoCardLayout(
  variantId: string,
): InfoCardLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
}

export function resolveInfoCardTypography(
  resolved: ResolvedBlockStyleView,
): InfoCardTypography {
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
    warningColor: "#b36b00",
    fontSize: bodyFontSize,
    titleFontSize: "16px",
    auxFontSize: "13px",
    lineHeight: "1.75",
    marginBlock: variantSpacing ?? "16px",
  };
}

export function resolveInfoCardCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

function optionalStringField(
  block: InfoCardBlock,
  variantId: string,
  field: "title" | "icon",
): { value?: string; issue?: RendererIssue } {
  const rawValue = (block.content as Record<string, unknown>)[field];

  if (rawValue == null || rawValue === "") {
    return {
      issue: createRendererIssue({
        code: "optional_slot_disabled",
        message: `info_card ${field} is absent and will not be rendered`,
        severity: "info",
        blockId: block.id,
        blockType: block.type,
        variantId,
        slotId: field,
        path: ["block", "content", field],
      }),
    };
  }

  if (typeof rawValue !== "string") {
    return {
      issue: createRendererIssue({
        code: "invalid_renderer_input",
        message: `info_card ${field} must be a string when present`,
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", field],
      }),
    };
  }

  const value = rawValue.trim();
  return value === "" ? {} : { value };
}

export function normalizeInfoCardContentForRenderer(
  block: InfoCardBlock,
  variantId: string,
): { content?: NormalizedInfoCardContent; issues: RendererIssue[] } {
  const issues: RendererIssue[] = [];
  const rawBody = (block.content as { body?: unknown }).body;

  if (typeof rawBody !== "string" || rawBody.trim() === "") {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "info_card renderer requires non-empty content.body",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "body"],
      }),
    );
    return { issues };
  }

  const title = optionalStringField(block, variantId, "title");
  const icon = optionalStringField(block, variantId, "icon");
  if (title.issue != null) {
    issues.push(title.issue);
  }
  if (icon.issue != null) {
    issues.push(icon.issue);
  }

  const body = rawBody.trim();
  const bodyLines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    content: {
      title: title.value,
      body,
      icon: icon.value,
      bodyLines: bodyLines.length > 0 ? bodyLines : [body],
    },
    issues,
  };
}
