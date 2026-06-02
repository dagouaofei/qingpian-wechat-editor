import type { HeadingBlock, TitleBlock } from "@/core/blocks";
import type { CopySafety, TitleBlockLayoutMode } from "@/core/styles";

import type { ResolvedBlockStyleView, SlotRenderState } from "./types";

export type TitleBlockTypography = {
  color: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  marginBlock: string;
  textAlign?: "left" | "center";
};

export function resolveTitleBlockTypography(
  resolved: ResolvedBlockStyleView,
  blockType: "title" | "heading",
): TitleBlockTypography {
  const themeColor = resolved.tokens.theme.color?.["text.default"] ?? "#333333";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    color: themeColor,
    fontSize: blockType === "title" ? "24px" : "17px",
    fontWeight: blockType === "title" ? "700" : "600",
    lineHeight: blockType === "title" ? "1.35" : "1.45",
    marginBlock: variantSpacing ?? (blockType === "title" ? "28px" : "22px"),
    textAlign: blockType === "title" ? "center" : "left",
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
      if (slotId === "badge" && block.meta?.sourceIndex != null) {
        results.push({
          slotId,
          state: "fallback",
          content: String(block.meta.sourceIndex).padStart(2, "0"),
          fallbackReason: "presentation_unavailable_use_meta_index",
        });
        continue;
      }

      if (slotId === "badge" && block.meta?.label) {
        results.push({
          slotId,
          state: "fallback",
          content: block.meta.label,
          fallbackReason: "presentation_unavailable_use_meta_label",
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
