import { assertCopySafeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import {
  resolveDividerCopySafety,
  resolveDividerLayout,
  resolveDividerSpacing,
  type DividerLayoutKind,
} from "@/core/renderer/divider-layout";
import type { BlockRenderContext, DividerCopyOutput } from "@/core/renderer/types";

function buildDividerCopyHtml(
  layout: DividerLayoutKind,
  spacing: ReturnType<typeof resolveDividerSpacing>,
): string {
  switch (layout) {
    case "simple_line":
      return wrapInlineElement(
        "section",
        {
          margin: `${spacing.marginBlock} 0`,
          borderTop: "1px solid #cccccc",
          height: "0",
          fontSize: "0",
          lineHeight: "0",
        },
        "",
      );
    case "dotted_line":
      return wrapInlineElement(
        "section",
        {
          margin: `${spacing.marginBlock} 0`,
          borderTop: "1px dashed #cccccc",
          height: "0",
          fontSize: "0",
          lineHeight: "0",
        },
        "",
      );
    case "section_space":
      return wrapInlineElement(
        "section",
        {
          margin: "0",
          height: spacing.sectionSpaceHeight,
          fontSize: "0",
          lineHeight: "0",
        },
        "",
      );
    default:
      throw new Error(`unsupported divider layout: ${layout satisfies never}`);
  }
}

export function renderDividerCopyHtml(
  context: BlockRenderContext,
): DividerCopyOutput {
  const layout = resolveDividerLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported divider variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const spacing = resolveDividerSpacing(context.resolvedBlockStyle);
  const html = buildDividerCopyHtml(layout, spacing);
  assertCopySafeHtml(html);

  return {
    kind: "divider_copy_html",
    blockId: context.block.id,
    blockType: "divider",
    variantId: context.resolvedBlockStyle.variantId,
    layout,
    html,
    copySafety: resolveDividerCopySafety(context.resolvedBlockStyle),
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertCopySafeHtml(html);
  return html.includes("style=");
}

export function assertDividerCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("Divider copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("Divider copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("Divider copy HTML must not use pseudo elements");
  }
}
