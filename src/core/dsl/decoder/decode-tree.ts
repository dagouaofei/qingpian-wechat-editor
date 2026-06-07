import type { Block, HeadingBlock, TitleBlock } from "@/core/blocks";
import { wrapCopySafeMarginSection } from "@/core/copy/copy-safe-primitives";
import { assertCopySafeHtml } from "@/core/copy/html-escape";
import type {
  InfoCardCopyOutput,
  InfoCardPreviewOutput,
  RendererOutputPlaceholder,
  TextBlockCopyOutput,
  TextBlockPreviewOutput,
  TitleBlockCopyOutput,
  TitleBlockPreviewOutput,
} from "@/core/renderer/types";

import type { DslNode, DslRenderTarget, VariantDslV1 } from "../runtime/dsl-types";
import { resolveSlotContentsForBlock } from "./block-slot-bindings";
import { renderDslTreeToHtml } from "./render-tree";

function extractTypographyFromTree(tree: DslNode): {
  fontSize?: string;
  fontWeight?: string | number;
  color?: string;
  lineHeight?: string;
} {
  if (tree.type === "element" && tree.children) {
    for (const child of tree.children) {
      if (child.type === "slot" && child.slot === "title" && child.style) {
        return {
          fontSize: child.style.fontSize != null ? String(child.style.fontSize) : undefined,
          fontWeight: child.style.fontWeight,
          color: child.style.color != null ? String(child.style.color) : undefined,
          lineHeight: child.style.lineHeight != null ? String(child.style.lineHeight) : undefined,
        };
      }
    }
  }
  return {};
}

export function decodeTreeToOutput(
  dsl: VariantDslV1,
  block: Block,
  target: DslRenderTarget,
): { ok: boolean; output?: RendererOutputPlaceholder; html?: string; issues: string[] } {
  if (!dsl.tree) {
    return { ok: false, issues: ["missing_tree"] };
  }

  const slots = resolveSlotContentsForBlock(block);
  const rendered = renderDslTreeToHtml(dsl.tree, slots, target);
  const issues = [...rendered.issues];

  if (!rendered.html.trim()) {
    return { ok: false, issues: ["dsl_tree_render_empty"] };
  }

  const isCopyTarget = target === "copy_wechat" || target === "qa_snapshot";
  const html = isCopyTarget ? wrapCopySafeMarginSection("16px 0", rendered.html) : rendered.html;

  if (isCopyTarget) {
    try {
      assertCopySafeHtml(html);
    } catch (error) {
      issues.push(error instanceof Error ? error.message : "copy_safe_assertion_failed");
      return { ok: false, issues };
    }
  }

  if (dsl.blockType === "heading" || dsl.blockType === "title") {
    const headingBlock = block as HeadingBlock | TitleBlock;
    const text = slots.title ?? "";
    const extracted = extractTypographyFromTree(dsl.tree);
    const typography = {
      fontSize: extracted.fontSize ?? "18px",
      fontWeight: String(extracted.fontWeight ?? "700"),
      lineHeight: extracted.lineHeight ?? "1.5",
      ...(extracted.color ? { color: extracted.color } : {}),
    };

    if (isCopyTarget) {
      const output: TitleBlockCopyOutput = {
        kind: "title_block_copy_html",
        blockId: block.id,
        blockType: dsl.blockType,
        variantId: dsl.id,
        layoutMode: "pill",
        html,
        copySafety: dsl.copySafety,
      };
      return { ok: true, output, html, issues };
    }

    const output: TitleBlockPreviewOutput = {
      kind: "title_block_preview",
      blockId: block.id,
      blockType: dsl.blockType,
      variantId: dsl.id,
      familyId: dsl.family ?? "dsl",
      layoutMode: "pill",
      text,
      headingLevel: headingBlock.type === "heading" ? headingBlock.content.level : 1,
      presentation: {},
      typography,
      slots: {
        title: { state: "active", content: text },
      },
    };
    return { ok: true, output, issues };
  }

  if (dsl.blockType === "info_card") {
    if (isCopyTarget) {
      const output: InfoCardCopyOutput = {
        kind: "info_card_copy_html",
        blockId: block.id,
        blockType: "info_card",
        variantId: dsl.id,
        layout: "key_takeaway",
        html,
        copySafety: dsl.copySafety,
      };
      return { ok: true, output, html, issues };
    }
    const body = slots.body ?? "";
    const output: InfoCardPreviewOutput = {
      kind: "info_card_preview",
      blockId: block.id,
      blockType: "info_card",
      variantId: dsl.id,
      layout: "key_takeaway",
      title: slots.title,
      titleState: slots.title ? "active" : "disabled",
      body,
      bodyLines: body.split("\n").filter((line) => line.length > 0),
      icon: undefined,
      iconState: "disabled",
      copySafety: dsl.copySafety,
    };
    return { ok: true, output, issues };
  }

  if (dsl.blockType === "lead" || dsl.blockType === "paragraph") {
    if (isCopyTarget) {
      const output: TextBlockCopyOutput = {
        kind: "text_block_copy_html",
        blockId: block.id,
        blockType: dsl.blockType,
        variantId: dsl.id,
        layout: "plain",
        html,
        copySafety: dsl.copySafety,
      };
      return { ok: true, output, html, issues };
    }

    const output: TextBlockPreviewOutput = {
      kind: "text_block_preview",
      blockId: block.id,
      blockType: dsl.blockType,
      variantId: dsl.id,
      layout: "plain",
      nodes: [{ text: slots.text ?? slots.title ?? slots.body ?? "" }],
    };
    return { ok: true, output, issues };
  }

  return { ok: false, issues: [`unsupported_tree_block_type:${dsl.blockType}`] };
}
