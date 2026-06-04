import { typographyForMiaopianPreset } from "@/config/miaopian-typography";
import type { InfoCardBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

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
  fontFamily: string;
};

import { INFO_CARD_VARIANT_LAYOUT } from "./expansion-layout-maps";

export function resolveInfoCardLayout(
  variantId: string,
): InfoCardLayoutKind | undefined {
  return INFO_CARD_VARIANT_LAYOUT[variantId];
}

export function resolveInfoCardTypography(
  resolved: ResolvedBlockStyleView,
): InfoCardTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];
  const presetTypography = typographyForMiaopianPreset(resolved.presetId);

  return {
    color: palette.textDefault,
    mutedColor: palette.textMuted,
    accentColor: palette.textAccent,
    warningColor: palette.warningColor,
    fontSize: bodyFontSize,
    titleFontSize: "16px",
    auxFontSize: "13px",
    lineHeight: presetTypography.bodyLineHeight,
    marginBlock: variantSpacing ?? "16px",
    fontFamily: presetTypography.fontFamily,
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
