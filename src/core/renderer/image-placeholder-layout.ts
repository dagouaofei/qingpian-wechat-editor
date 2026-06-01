import type { ImagePlaceholderBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type ImagePlaceholderLayoutKind = "simple" | "caption" | "card";

export type NormalizedImagePlaceholderContent = {
  caption?: string;
  aspectRatio: string;
  position: string;
  suggestion?: string;
  placeholderLabel: string;
};

export type ImagePlaceholderTypography = {
  color: string;
  mutedColor: string;
  accentColor: string;
  fontSize: string;
  auxFontSize: string;
  lineHeight: string;
  marginBlock: string;
};

const VARIANT_LAYOUT_MAP: Record<string, ImagePlaceholderLayoutKind> = {
  image_placeholder_simple: "simple",
  image_placeholder_caption: "caption",
  image_placeholder_card: "card",
};

export function resolveImagePlaceholderLayout(
  variantId: string,
): ImagePlaceholderLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
}

export function resolveImagePlaceholderTypography(
  resolved: ResolvedBlockStyleView,
): ImagePlaceholderTypography {
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
    auxFontSize: "14px",
    lineHeight: "1.7",
    marginBlock: variantSpacing ?? "18px",
  };
}

export function resolveImagePlaceholderCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

function optionalStringField(
  block: ImagePlaceholderBlock,
  variantId: string,
  field: "caption" | "suggestion",
): { value?: string; issue?: RendererIssue } {
  const rawValue = (block.content as Record<string, unknown>)[field];

  if (rawValue == null || rawValue === "") {
    return {
      issue: createRendererIssue({
        code: "optional_slot_disabled",
        message: `image_placeholder ${field} is absent and will not be rendered`,
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
        message: `image_placeholder ${field} must be a string when present`,
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

export function normalizeImagePlaceholderContentForRenderer(
  block: ImagePlaceholderBlock,
  variantId: string,
): { content: NormalizedImagePlaceholderContent; issues: RendererIssue[] } {
  const issues: RendererIssue[] = [
    createRendererIssue({
      code: "optional_slot_disabled",
      message: "image slot is disabled for Release 1 placeholder renderer",
      severity: "info",
      blockId: block.id,
      blockType: block.type,
      variantId,
      slotId: "image",
      path: ["block", "content", "image"],
    }),
  ];
  const caption = optionalStringField(block, variantId, "caption");
  const suggestion = optionalStringField(block, variantId, "suggestion");
  if (caption.issue != null) {
    issues.push(caption.issue);
  }
  if (suggestion.issue != null) {
    issues.push(suggestion.issue);
  }

  return {
    content: {
      caption: caption.value,
      suggestion: suggestion.value,
      aspectRatio: block.content.aspectRatio ?? "16:9",
      position: block.content.position ?? "full",
      placeholderLabel: "Image placeholder only; no image resource rendered",
    },
    issues,
  };
}
