import type { CtaBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type CtaLayoutKind = "plain_text" | "button_like" | "qr_placeholder";

export type NormalizedCtaContent = {
  text: string;
  action?: string;
  placeholderLabel: string;
};

export type CtaTypography = {
  color: string;
  mutedColor: string;
  accentColor: string;
  fontSize: string;
  actionFontSize: string;
  lineHeight: string;
  marginBlock: string;
};

const VARIANT_LAYOUT_MAP: Record<string, CtaLayoutKind> = {
  cta_plain_text: "plain_text",
  cta_button_like: "button_like",
  cta_qr_placeholder: "qr_placeholder",
};

export function resolveCtaLayout(variantId: string): CtaLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
}

export function resolveCtaTypography(
  resolved: ResolvedBlockStyleView,
): CtaTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    color: palette.textDefault,
    mutedColor: palette.textMuted,
    accentColor: palette.textAccent,
    fontSize: bodyFontSize,
    actionFontSize: "15px",
    lineHeight: "1.75",
    marginBlock: variantSpacing ?? "18px",
  };
}

export function resolveCtaCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

export function normalizeCtaContentForRenderer(
  block: CtaBlock,
  variantId: string,
): { content?: NormalizedCtaContent; issues: RendererIssue[] } {
  const issues: RendererIssue[] = [];
  const rawText = (block.content as { text?: unknown }).text;

  if (typeof rawText !== "string" || rawText.trim() === "") {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "cta renderer requires non-empty content.text",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "text"],
      }),
    );
    return { issues };
  }

  const rawAction = (block.content as { action?: unknown }).action;
  let action: string | undefined;

  if (rawAction == null || rawAction === "") {
    issues.push(
      createRendererIssue({
        code: "optional_slot_disabled",
        message: "cta action is absent and will not be rendered",
        severity: "info",
        blockId: block.id,
        blockType: block.type,
        variantId,
        slotId: "action",
        path: ["block", "content", "action"],
      }),
    );
  } else if (typeof rawAction === "string") {
    action = rawAction.trim();
  } else {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "cta action must be a string when present",
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "action"],
      }),
    );
  }

  return {
    content: {
      text: rawText.trim(),
      action: action === "" ? undefined : action,
      placeholderLabel:
        variantId === "cta_qr_placeholder"
          ? "QR placeholder only; no QR generated"
          : "Placeholder action; no live navigation",
    },
    issues,
  };
}
