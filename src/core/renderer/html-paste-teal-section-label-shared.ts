/**
 * Shared visual tokens for HTML paste teal section label (007B / 007C).
 */

import type { HeadingBlock } from "@/core/blocks";

export const HTML_PASTE_TEAL_SECTION_COLOR = "#0d9488";

export function resolveHtmlPasteTealSectionLabel(block: HeadingBlock): string {
  return (
    block.meta?.label?.trim() ||
    `SECTION ${String(block.meta?.sourceIndex ?? 2).padStart(2, "0")}`
  );
}
