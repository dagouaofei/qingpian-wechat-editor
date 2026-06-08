import type { Block } from "@/core/blocks";
import type { Article } from "@/core/article";
import { renderHtmlPasteTealSectionLabelHeadingCopy } from "@/core/copy/html-paste-candidate-copy";
import { renderTitleBlockCopyHtml } from "@/core/copy/title-block-copy";
import { buildBlockRenderContext } from "@/core/renderer/context";
import { renderCta } from "@/core/renderer/cta-renderer";
import { renderDivider } from "@/core/renderer/divider-renderer";
import { renderHighlight } from "@/core/renderer/highlight-renderer";
import { renderHtmlPasteTealSectionLabelHeadingPreview } from "@/core/renderer/html-paste-candidate-preview";
import { renderImagePlaceholder } from "@/core/renderer/image-placeholder-renderer";
import { renderInfoCard } from "@/core/renderer/info-card-renderer";
import { renderList } from "@/core/renderer/list-renderer";
import { renderQuote } from "@/core/renderer/quote-renderer";
import { renderTextBlock } from "@/core/renderer/text-block-renderer";
import { renderTitleBlockPreview } from "@/core/renderer/title-block-preview";
import { renderTargetForMode } from "@/core/renderer/types";
import type {
  BlockRenderContext,
  RendererOutputPlaceholder,
  RendererResult,
} from "@/core/renderer/types";
import { HTML_PASTE_CANDIDATE_VARIANT_IDS } from "@/core/copy/html-paste-candidate-copy";
import {
  createFirstWaveRequiredVariantRegistry,
  getPresetById,
  getThemeById,
} from "@/core/styles";
import {
  STYLE_SCHEMA_VERSION,
  type ResolvedArticleStyle,
  type VariantDefinition,
} from "@/core/styles/types";

import type { DslNode, DslRenderTarget, VariantDslV1, VariantRenderContract } from "../runtime/dsl-types";
import { decodeTreeToOutput } from "./decode-tree";

function variantDslToDefinition(dsl: VariantDslV1): VariantDefinition {
  const legacySlots = dsl.meta?.legacySlots as VariantDefinition["slots"] | undefined;
  return {
    id: dsl.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: dsl.blockType,
    family: dsl.family ?? "dsl",
    name: dsl.id,
    label: dsl.label ?? dsl.id,
    status: "experimental",
    tokens: dsl.tokens,
    slots: legacySlots ?? (dsl.slots as VariantDefinition["slots"]),
    componentProtocol: dsl.componentProtocol as VariantDefinition["componentProtocol"],
    compatibility: {
      copySafety: dsl.copySafety,
      ...(dsl.compatibility ?? {}),
    },
  };
}

function buildResolvedArticleStyle(
  article: Article,
  block: Block,
  dsl: VariantDslV1,
): ResolvedArticleStyle {
  const registry = createFirstWaveRequiredVariantRegistry();
  const presetId = article.styleAssignment?.presetId ?? "business";
  const themeId = article.styleAssignment?.themeId ?? "businessBlue";
  const preset = getPresetById(registry, presetId) ?? registry.presets[0]!;
  const theme =
    getThemeById(registry, themeId) ??
    getThemeById(registry, preset.themeId) ??
    registry.themes[0]!;

  const variant = variantDslToDefinition(dsl);
  return {
    articleId: article.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    presetId,
    themeId,
    blocks: [
      {
        blockId: block.id,
        blockType: block.type,
        variantId: dsl.id,
        variant,
        presetId,
        themeId,
        tokens: {
          theme: theme.tokens,
          variant: dsl.tokens ?? {},
        },
        slots: variant.slots,
        compatibility: variant.compatibility,
        source: "explicit",
      },
    ],
  };
}

function isHtmlPasteCandidateDsl(dsl: VariantDslV1): boolean {
  const familyId = (dsl.componentProtocol as { familyId?: string } | undefined)?.familyId;
  return (
    dsl.family === "htmlPasteCandidate" ||
    familyId === "htmlPasteCandidate" ||
    (HTML_PASTE_CANDIDATE_VARIANT_IDS as readonly string[]).includes(dsl.id)
  );
}

function buildInfoCardFallbackTree(dsl: VariantDslV1): DslNode {
  const children: DslNode[] = [];
  if (dsl.slots?.title) {
    children.push({
      type: "slot",
      slot: "title",
      tag: "strong",
      style: { display: "block", marginBottom: "4px" },
    });
  }
  children.push({
    type: "slot",
    slot: "body",
    tag: "span",
    style: { fontSize: "16px", lineHeight: "1.8" },
  });

  return {
    type: "element",
    tag: "section",
    style: {
      backgroundColor: String(dsl.tokens?.["surface.background"] ?? "#f7f8fa"),
      border: String(dsl.tokens?.["border.all"] ?? "1px solid #e5e7eb"),
      padding: "12px 14px",
      margin: String(dsl.tokens?.["spacing.block"] ?? "16px 0"),
    },
    children,
  };
}

function mapRendererResult(
  result: RendererResult<RendererOutputPlaceholder>,
): { ok: boolean; output?: RendererOutputPlaceholder; html?: string; issues: string[] } {
  if (!result.ok || !result.output) {
    return {
      ok: false,
      issues: result.issues.map((issue) => issue.message),
    };
  }
  const html = "html" in result.output ? result.output.html : undefined;
  return { ok: true, output: result.output, html, issues: [] };
}

function renderViaContextRenderer(
  context: BlockRenderContext,
  renderer: (ctx: BlockRenderContext) => RendererResult<RendererOutputPlaceholder>,
): { ok: boolean; output?: RendererOutputPlaceholder; html?: string; issues: string[] } {
  return mapRendererResult(renderer(context));
}

const CONTRACT_RENDERERS: Partial<
  Record<VariantRenderContract, (ctx: BlockRenderContext) => RendererResult<RendererOutputPlaceholder>>
> = {
  text_block_v1: renderTextBlock,
  divider_block_v1: renderDivider,
  list_block_v1: renderList,
  quote_block_v1: renderQuote,
  highlight_block_v1: renderHighlight,
  cta_block_v1: renderCta,
  image_placeholder_v1: renderImagePlaceholder,
};

export function decodeRenderContract(
  dsl: VariantDslV1,
  block: Block,
  article: Article,
  target: DslRenderTarget,
): { ok: boolean; output?: RendererOutputPlaceholder; html?: string; issues: string[] } {
  const issues: string[] = [];
  const mode = target === "copy_wechat" || target === "qa_snapshot" ? "copy" : "preview";
  const resolvedArticleStyle = buildResolvedArticleStyle(article, block, dsl);
  const contextResult = buildBlockRenderContext({
    article,
    blockId: block.id,
    resolvedArticleStyle,
    mode,
    target: renderTargetForMode(mode),
  });

  if (!contextResult.context) {
    return {
      ok: false,
      issues: contextResult.issues.map((issue) => issue.message),
    };
  }

  try {
    if (dsl.renderContract === "title_block_v1") {
      if (isHtmlPasteCandidateDsl(dsl)) {
        const output =
          mode === "copy"
            ? renderHtmlPasteTealSectionLabelHeadingCopy(contextResult.context)
            : renderHtmlPasteTealSectionLabelHeadingPreview(contextResult.context);
        const html = mode === "copy" && "html" in output ? output.html : undefined;
        return { ok: true, output, html, issues };
      }

      const output =
        mode === "copy"
          ? renderTitleBlockCopyHtml(contextResult.context)
          : renderTitleBlockPreview(contextResult.context);
      const html = mode === "copy" && "html" in output ? output.html : undefined;
      return { ok: true, output, html, issues };
    }

    if (dsl.renderContract === "info_card_v1") {
      if (dsl.tree) {
        return decodeTreeToOutput(dsl, block, target, article);
      }

      const registryResult = renderViaContextRenderer(contextResult.context, renderInfoCard);
      if (registryResult.ok) {
        return { ...registryResult, issues };
      }

      return decodeTreeToOutput(
        { ...dsl, tree: buildInfoCardFallbackTree(dsl) },
        block,
        target,
        article,
      );
    }

    const renderer = dsl.renderContract
      ? CONTRACT_RENDERERS[dsl.renderContract]
      : undefined;

    if (renderer) {
      return renderViaContextRenderer(contextResult.context, renderer);
    }

    issues.push(`unsupported_render_contract:${dsl.renderContract ?? "none"}`);
    return { ok: false, issues };
  } catch (error) {
    issues.push(error instanceof Error ? error.message : "render_contract_failed");
    return { ok: false, issues };
  }
}
