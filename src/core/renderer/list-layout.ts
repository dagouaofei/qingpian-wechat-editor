import type { ListBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type ListLayoutKind = "plain_bullets" | "numbered_steps" | "checklist_cards";

export type NormalizedListItem = {
  text: string;
  subItems: string[];
  sourceIndex: number;
};

export type ListTypography = {
  color: string;
  mutedColor: string;
  markerColor: string;
  fontSize: string;
  subItemFontSize: string;
  lineHeight: string;
  marginBlock: string;
  itemGap: string;
};

import { LIST_VARIANT_LAYOUT } from "./expansion-layout-maps";

export function resolveListLayout(variantId: string): ListLayoutKind | undefined {
  return LIST_VARIANT_LAYOUT[variantId];
}

export function resolveListTypography(
  resolved: ResolvedBlockStyleView,
): ListTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    color: palette.textDefault,
    mutedColor: palette.textMuted,
    markerColor: palette.textAccent,
    fontSize: bodyFontSize,
    subItemFontSize: "15px",
    lineHeight: "1.75",
    marginBlock: variantSpacing ?? "16px",
    itemGap: "8px",
  };
}

export function resolveListCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function itemTextFromUnknown(item: unknown): string | undefined {
  if (!isRecord(item) || typeof item.text !== "string") {
    return undefined;
  }

  return item.text.trim();
}

function subItemsFromUnknown(
  item: unknown,
  options: {
    block: ListBlock;
    variantId: string;
    itemIndex: number;
  },
): { subItems: string[]; warnings: RendererIssue[] } {
  const warnings: RendererIssue[] = [];
  if (!isRecord(item) || item.subItems == null) {
    return { subItems: [], warnings };
  }

  if (!Array.isArray(item.subItems)) {
    return {
      subItems: [],
      warnings: [
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "list item subItems must be an array when present",
          severity: "warning",
          blockId: options.block.id,
          blockType: options.block.type,
          variantId: options.variantId,
          path: ["block", "content", "items", options.itemIndex, "subItems"],
        }),
      ],
    };
  }

  const subItems: string[] = [];
  item.subItems.forEach((subItem, subIndex) => {
    if (typeof subItem !== "string" || subItem.trim() === "") {
      warnings.push(
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "list subItem text must be a non-empty string",
          severity: "warning",
          blockId: options.block.id,
          blockType: options.block.type,
          variantId: options.variantId,
          path: [
            "block",
            "content",
            "items",
            options.itemIndex,
            "subItems",
            subIndex,
          ],
        }),
      );
      return;
    }

    subItems.push(subItem.trim());
  });

  return { subItems, warnings };
}

export function normalizeListItemsForRenderer(
  block: ListBlock,
  variantId: string,
): { items: NormalizedListItem[]; issues: RendererIssue[] } {
  const rawItems = (block.content as { items?: unknown }).items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      items: [],
      issues: [
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "list renderer requires at least one item",
          blockId: block.id,
          blockType: block.type,
          variantId,
          path: ["block", "content", "items"],
        }),
      ],
    };
  }

  const issues: RendererIssue[] = [];
  const items: NormalizedListItem[] = [];

  rawItems.forEach((rawItem, itemIndex) => {
    const text = itemTextFromUnknown(rawItem);
    if (text == null || text === "") {
      issues.push(
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "list item text must be a non-empty string",
          severity: "warning",
          blockId: block.id,
          blockType: block.type,
          variantId,
          path: ["block", "content", "items", itemIndex, "text"],
        }),
      );
      return;
    }

    const { subItems, warnings } = subItemsFromUnknown(rawItem, {
      block,
      variantId,
      itemIndex,
    });
    issues.push(...warnings);
    items.push({ text, subItems, sourceIndex: itemIndex });
  });

  if (items.length === 0) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "list renderer could not find any renderable items",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "items"],
      }),
    );
  }

  return { items, issues };
}
