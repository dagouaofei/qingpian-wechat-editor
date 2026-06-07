import type { Block } from "@/core/blocks";
import { wrapCopySafeMarginSection } from "@/core/copy/copy-safe-primitives";
import { assertCopySafeHtml } from "@/core/copy/html-escape";
import type {
  DslTreeHtmlPreviewOutput,
  InfoCardCopyOutput,
  RendererOutputPlaceholder,
  TextBlockCopyOutput,
  TitleBlockCopyOutput,
} from "@/core/renderer/types";

import type { DslRenderTarget, VariantDslV1 } from "../runtime/dsl-types";
import { listRequiredTreeSlots, resolveSlotsForDslDecode } from "./resolve-dsl-slots";
import { renderDslTreeToHtml } from "./render-tree";

function visiblePlainText(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function buildTreeHtmlPreviewOutput(
  dsl: VariantDslV1,
  block: Block,
  html: string,
): DslTreeHtmlPreviewOutput {
  return {
    kind: "dsl_tree_html_preview",
    blockId: block.id,
    blockType: dsl.blockType,
    variantId: dsl.id,
    html,
    copySafety: dsl.copySafety,
  };
}

export function decodeTreeToOutput(
  dsl: VariantDslV1,
  block: Block,
  target: DslRenderTarget,
): { ok: boolean; output?: RendererOutputPlaceholder; html?: string; issues: string[] } {
  if (!dsl.tree) {
    return { ok: false, issues: ["missing_tree"] };
  }

  const slots = resolveSlotsForDslDecode(dsl, block);
  const requiredSlots = listRequiredTreeSlots(dsl);
  const rendered = renderDslTreeToHtml(dsl.tree, slots, target);
  const issues = [...rendered.issues];

  const missingSlots = requiredSlots.filter((slot) => !(slots[slot] ?? "").trim());
  for (const slot of missingSlots) {
    issues.push(`DSL_SLOT_MISSING:${slot}`);
  }

  const requiresTitle = dsl.blockType === "heading" || dsl.blockType === "title";
  if (requiresTitle && missingSlots.includes("title")) {
    return { ok: false, issues: ["DSL_SLOT_MISSING:title", ...issues] };
  }

  const plainText = visiblePlainText(rendered.html);
  if (!plainText) {
    return { ok: false, issues: ["DSL_RENDER_EMPTY", ...issues] };
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

    if (dsl.blockType === "heading" || dsl.blockType === "title") {
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

    if (dsl.blockType === "info_card") {
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

    if (dsl.blockType === "lead" || dsl.blockType === "paragraph") {
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

    return { ok: false, issues: [`unsupported_tree_block_type:${dsl.blockType}`] };
  }

  const output = buildTreeHtmlPreviewOutput(dsl, block, rendered.html);
  return { ok: true, output, html: rendered.html, issues };
}
