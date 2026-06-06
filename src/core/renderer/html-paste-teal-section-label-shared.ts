/**
 * HTML paste section label — dynamic numbering + theme-aware tokens (007C-FIX-B).
 * Source reference color is evidence-only; never used for final render.
 */

import type { HeadingBlock } from "@/core/blocks";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import { resolveHeadingIndexLabel } from "./heading-ordinal";
import type { BlockRenderContext } from "./types";

/** Evidence / source HTML reference only — not final render color */
export const HTML_PASTE_SOURCE_REFERENCE_COLOR = "#0d9488";

/** @deprecated Evidence/fixture reference only — use resolveUserSelectableHeadingAccentColor */
export const HTML_PASTE_TEAL_SECTION_COLOR = HTML_PASTE_SOURCE_REFERENCE_COLOR;

export type HtmlPasteSectionLabelStyleTokens = {
  sectionLabelText: string;
  accentColor: string;
  labelTextColor: string;
};

export function resolveHtmlPasteSectionLabelText(context: BlockRenderContext): string {
  const block = context.block as HeadingBlock;
  const indexLabel = resolveHeadingIndexLabel(context.article, block.id);
  return `SECTION ${indexLabel}`;
}

export function resolveUserSelectableHeadingAccentColor(context: BlockRenderContext): string {
  return resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme).textAccent;
}

export function resolveHtmlPasteSectionLabelStyleTokens(
  context: BlockRenderContext,
): HtmlPasteSectionLabelStyleTokens {
  return {
    sectionLabelText: resolveHtmlPasteSectionLabelText(context),
    accentColor: resolveUserSelectableHeadingAccentColor(context),
    labelTextColor: "#ffffff",
  };
}
