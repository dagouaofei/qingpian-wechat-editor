import type { HeadingBlock, TitleBlock } from "@/core/blocks";
import { typographyForMiaopianPreset } from "@/config/miaopian-typography";
import type { CopySafety, TitleBlockLayoutMode } from "@/core/styles";

import {
  resolveTitleHeadingIconAssetId,
  resolveTitleHeadingIconGlyph,
  titleHeadingUsesCornerAccent,
} from "./title-heading-assets";
import type { ResolvedBlockStyleView, SlotRenderState } from "./types";

export type TitleBlockTypography = {
  color: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  marginBlock: string;
  textAlign?: "left" | "center";
  accentColor?: string;
  mutedColor?: string;
  fontFamily?: string;
};

export function resolveTitleBlockTypography(
  resolved: ResolvedBlockStyleView,
  blockType: "title" | "heading",
): TitleBlockTypography {
  const themeColor = resolved.tokens.theme.color?.["text.default"] ?? "#333333";
  const accentColor = resolved.tokens.theme.color?.["text.accent"] ?? themeColor;
  const mutedColor = resolved.tokens.theme.color?.["text.muted"] ?? themeColor;
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];
  const variantWeight = resolved.tokens.variant?.["typography.weight"];
  const variantSize = resolved.tokens.variant?.["typography.size"];
  const presetTypography = typographyForMiaopianPreset(resolved.presetId);

  const defaultTitleSize =
    blockType === "title" ? presetTypography.titleFontSize : presetTypography.headingFontSize;
  const defaultLineHeight =
    blockType === "title"
      ? presetTypography.titleLineHeight
      : presetTypography.headingLineHeight;
  const defaultWeight =
    variantWeight === "bold"
      ? "700"
      : blockType === "title"
        ? presetTypography.titleFontWeight
        : presetTypography.headingFontWeight;

  return {
    color: themeColor,
    fontSize: variantSize ?? defaultTitleSize,
    fontWeight: defaultWeight,
    lineHeight: defaultLineHeight,
    marginBlock: variantSpacing ?? (blockType === "title" ? "28px" : "22px"),
    textAlign: blockType === "title" ? "center" : "left",
    accentColor,
    mutedColor,
    fontFamily: presetTypography.fontFamily,
  };
}

export type ResolvedTitleBlockSlotContent = {
  slotId: string;
  state: SlotRenderState;
  content?: string;
  fallbackReason?: string;
};

export function extractTitleBlockText(block: TitleBlock | HeadingBlock): string {
  return block.content.text;
}

export function resolveTitleBlockSlotContents(
  block: TitleBlock | HeadingBlock,
  resolved: ResolvedBlockStyleView,
  slotStates: Record<string, { state: SlotRenderState; fallbackReason?: string; binding: { source: string } }>,
): ResolvedTitleBlockSlotContent[] {
  const results: ResolvedTitleBlockSlotContent[] = [];

  for (const [slotId, slotState] of Object.entries(slotStates)) {
    if (slotState.binding.source === "block.content.text") {
      results.push({
        slotId,
        state: "active",
        content: extractTitleBlockText(block),
      });
      continue;
    }

    if (slotState.state === "disabled") {
      results.push({
        slotId,
        state: "disabled",
        fallbackReason: slotState.fallbackReason ?? "binding_source_disabled",
      });
      continue;
    }

    if (slotState.binding.source === "block.meta") {
      const label = block.meta?.label;
      results.push(
        label
          ? { slotId, state: "active", content: label }
          : {
              slotId,
              state: "fallback",
              fallbackReason: "meta_label_missing",
            },
      );
      continue;
    }

    if (slotState.binding.source === "variant.presentation") {
      const layoutMode = resolved.componentProtocol.layoutMode;
      const variantId = resolved.variantId;

      if (slotId === "icon") {
        const assetId = resolveTitleHeadingIconAssetId(
          variantId,
          block.type,
          layoutMode ?? "plain",
        );
        const glyph = resolveTitleHeadingIconGlyph(assetId);
        results.push({
          slotId,
          state: "fallback",
          content: assetId,
          fallbackReason: "presentation_default_icon_asset",
        });
        continue;
      }

      if (slotId === "corner" && titleHeadingUsesCornerAccent(variantId)) {
        results.push({
          slotId,
          state: "active",
          content: "mark-corner-accent",
        });
        continue;
      }

      if (slotId === "badge") {
        if (block.meta?.sourceIndex != null) {
          results.push({
            slotId,
            state: "fallback",
            content: String(block.meta.sourceIndex).padStart(2, "0"),
            fallbackReason: "presentation_unavailable_use_meta_index",
          });
          continue;
        }

        if (layoutMode === "top_badge") {
          results.push({
            slotId,
            state: "fallback",
            content: block.meta?.label ?? (block.type === "heading" ? "话题" : "精选"),
            fallbackReason: "presentation_default_topic_badge",
          });
          continue;
        }

        if (block.meta?.label) {
          results.push({
            slotId,
            state: "fallback",
            content: block.meta.label,
            fallbackReason: "presentation_unavailable_use_meta_label",
          });
          continue;
        }
      }

      if (slotId === "decoration" && layoutMode === "left_bar") {
        results.push({
          slotId,
          state: "fallback",
          content: block.type === "title" ? "主标题" : "SECTION",
          fallbackReason: "presentation_default_left_bar_label",
        });
        continue;
      }

      if (slotId === "divider" && layoutMode === "bottom_line") {
        results.push({
          slotId,
          state: "active",
          content: "editorial-line",
        });
        continue;
      }

      results.push({
        slotId,
        state: "disabled",
        fallbackReason: "presentation_unavailable",
      });
      continue;
    }

    results.push({
      slotId,
      state: slotState.state,
      fallbackReason: slotState.fallbackReason,
    });
  }

  return results;
}

export function slotContentMap(
  slots: ResolvedTitleBlockSlotContent[],
): Record<string, { state: SlotRenderState; content?: string; fallbackReason?: string }> {
  return Object.fromEntries(
    slots.map((slot) => [
      slot.slotId,
      {
        state: slot.state,
        content: slot.content,
        fallbackReason: slot.fallbackReason,
      },
    ]),
  );
}

export function getSlotContent(
  slots: ResolvedTitleBlockSlotContent[],
  slotId: string,
): ResolvedTitleBlockSlotContent | undefined {
  return slots.find((slot) => slot.slotId === slotId);
}

export function resolveLayoutMode(
  resolved: ResolvedBlockStyleView,
): TitleBlockLayoutMode | undefined {
  return resolved.componentProtocol.layoutMode;
}

export function resolveCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}
