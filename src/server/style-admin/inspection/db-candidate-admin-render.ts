import type { BlockType } from "@prisma/client";

import { parseArticle } from "@/core/article";
import type { Article } from "@/core/article";
import type { HeadingBlock, InfoCardBlock } from "@/core/blocks";
import {
  copySafeCardContentStyle,
  wrapCopySafeMarginSection,
  wrapTitleHeadingElement,
} from "@/core/copy/copy-safe-primitives";
import { assertCopySafeHtml, escapeHtml } from "@/core/copy/html-escape";
import { wrapInlineElement } from "@/core/copy/inline-style";
import { buildBlockRenderContext } from "@/core/renderer/context";
import { createRendererIssue } from "@/core/renderer/issues";
import type {
  BlockRenderInput,
  InfoCardCopyOutput,
  InfoCardPreviewOutput,
  RendererOutputPlaceholder,
  RendererResult,
  TitleBlockCopyOutput,
  TitleBlockPreviewOutput,
} from "@/core/renderer/types";

import type { DbCandidateInspectionSource } from "./candidate-inspection-types";

function tokenValue(tokens: Record<string, string> | undefined, key: string, fallback: string): string {
  return tokens?.[key] ?? fallback;
}

function readTokens(source: DbCandidateInspectionSource): Record<string, string> {
  const definition = source.definitionJson;
  if (typeof definition !== "object" || definition === null || Array.isArray(definition)) {
    return {};
  }
  const tokens = (definition as Record<string, unknown>).tokens;
  if (typeof tokens !== "object" || tokens === null || Array.isArray(tokens)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [key, String(value)]),
  );
}

function renderAdminHeadingCopy(
  context: NonNullable<ReturnType<typeof buildBlockRenderContext>["context"]>,
  source: DbCandidateInspectionSource,
): TitleBlockCopyOutput {
  const block = context.block as HeadingBlock;
  const tokens = readTokens(source);
  const text = block.content.text ?? "";
  const borderLeft = tokenValue(tokens, "border.left", "4px solid #1677ff");
  const fontSize = tokenValue(tokens, "typography.size", "18px");
  const fontWeight = tokenValue(tokens, "typography.weight", "700");
  const color = tokenValue(tokens, "color.text", "#111111");

  const inner = wrapInlineElement(
    "span",
    {
      display: "block",
      fontSize,
      fontWeight,
      color,
      lineHeight: "1.5",
    },
    escapeHtml(text),
  );

  const html = wrapCopySafeMarginSection(
    "16px 0",
    wrapInlineElement(
      "section",
      {
        padding: tokenValue(tokens, "spacing.inner", "8px 0"),
        borderLeft,
      },
      inner,
    ),
  );

  assertCopySafeHtml(html);

  return {
    kind: "title_block_copy_html",
    blockId: block.id,
    blockType: "heading",
    variantId: source.runtimeVariantId,
    layoutMode: "pill",
    html,
    copySafety: "strict",
  };
}

function renderAdminHeadingPreview(
  context: NonNullable<ReturnType<typeof buildBlockRenderContext>["context"]>,
  source: DbCandidateInspectionSource,
): TitleBlockPreviewOutput {
  const block = context.block as HeadingBlock;
  return {
    kind: "title_block_preview",
    blockId: block.id,
    blockType: "heading",
    variantId: source.runtimeVariantId,
    layoutMode: "pill",
    familyId: source.styleFamily,
    text: block.content.text ?? "",
    headingLevel: 2,
    presentation: {},
    slots: {
      title: {
        state: "active",
        content: block.content.text ?? "",
      },
    },
  };
}

function renderAdminInfoCardCopy(
  context: NonNullable<ReturnType<typeof buildBlockRenderContext>["context"]>,
  source: DbCandidateInspectionSource,
): InfoCardCopyOutput {
  const block = context.block as InfoCardBlock;
  const tokens = readTokens(source);
  const title = block.content.title ?? "";
  const body = block.content.body ?? "";
  const inner =
    (title
      ? wrapInlineElement(
          "strong",
          { display: "block", marginBottom: "8px" },
          escapeHtml(title),
        )
      : "") +
    wrapInlineElement("p", { margin: "0" }, escapeHtml(body));

  const html = wrapCopySafeMarginSection(
    tokenValue(tokens, "spacing.block", "16px 0"),
    wrapInlineElement(
      "section",
      {
        ...copySafeCardContentStyle(
          {
            color: "#333333",
            fontSize: "16px",
            lineHeight: "1.8",
          },
          {
            backgroundColor: tokenValue(tokens, "surface.background", "#f7f8fa"),
            border: tokenValue(tokens, "border.all", "1px solid #e5e7eb"),
            padding: tokenValue(tokens, "spacing.inner", "14px"),
          },
        ),
        borderRadius: tokenValue(tokens, "radius.card", "8px"),
      },
      inner,
    ),
  );

  assertCopySafeHtml(html);

  return {
    kind: "info_card_copy_html",
    blockId: block.id,
    blockType: "info_card",
    variantId: source.runtimeVariantId,
    layout: "key_takeaway",
    html,
    copySafety: "strict",
  };
}

function renderAdminInfoCardPreview(
  context: NonNullable<ReturnType<typeof buildBlockRenderContext>["context"]>,
  source: DbCandidateInspectionSource,
): InfoCardPreviewOutput {
  const block = context.block as InfoCardBlock;
  const body = block.content.body ?? "";
  return {
    kind: "info_card_preview",
    blockId: block.id,
    blockType: "info_card",
    variantId: source.runtimeVariantId,
    layout: "key_takeaway",
    title: block.content.title,
    titleState: block.content.title ? "active" : "fallback",
    body,
    bodyLines: body.split("\n").filter(Boolean),
    iconState: "fallback",
  };
}

export function renderAdminDbCandidateBlock(
  input: BlockRenderInput,
  source: DbCandidateInspectionSource,
): RendererResult<RendererOutputPlaceholder> {
  const { context, issues: contextIssues } = buildBlockRenderContext({
    article: input.article,
    blockId: input.block.id,
    resolvedArticleStyle: input.resolvedArticleStyle,
    mode: input.mode,
    target: input.target,
  });

  if (context == null) {
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: source.runtimeVariantId,
      mode: input.mode,
      target: input.target,
      issues: contextIssues,
      warnings: [],
    };
  }

  try {
    if (source.blockType === "heading") {
      const output =
        input.mode === "copy"
          ? renderAdminHeadingCopy(context, source)
          : renderAdminHeadingPreview(context, source);
      return {
        ok: true,
        blockId: input.block.id,
        blockType: input.block.type as BlockType,
        variantId: source.runtimeVariantId,
        mode: input.mode,
        target: input.target,
        output,
        issues: [],
        warnings: contextIssues.filter((issue) => issue.severity !== "error"),
      };
    }

    if (source.blockType === "info_card") {
      const output =
        input.mode === "copy"
          ? renderAdminInfoCardCopy(context, source)
          : renderAdminInfoCardPreview(context, source);
      return {
        ok: true,
        blockId: input.block.id,
        blockType: input.block.type as BlockType,
        variantId: source.runtimeVariantId,
        mode: input.mode,
        target: input.target,
        output,
        issues: [],
        warnings: contextIssues.filter((issue) => issue.severity !== "error"),
      };
    }
  } catch (error) {
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: source.runtimeVariantId,
      mode: input.mode,
      target: input.target,
      issues: [
        createRendererIssue({
          code: "renderer_not_registered",
          message: error instanceof Error ? error.message : "Admin inspection render failed",
          blockId: input.block.id,
          blockType: input.block.type,
        }),
      ],
      warnings: [],
    };
  }

  return {
    ok: false,
    blockId: input.block.id,
    blockType: input.block.type,
    variantId: source.runtimeVariantId,
    mode: input.mode,
    target: input.target,
    issues: [
      createRendererIssue({
        code: "unsupported_block_type",
        message: `Admin inspection fallback does not support blockType=${source.blockType}`,
        blockId: input.block.id,
        blockType: input.block.type,
      }),
    ],
    warnings: [],
  };
}

export function buildDbCandidateInspectionArticle(
  source: DbCandidateInspectionSource,
  fixture: { blockContent: Record<string, unknown> },
): Article {
  const blockId = "11111111-1111-4111-8111-000000000010";
  return parseArticle({
    id: "22222222-2222-4222-8222-222222229010",
    version: 1,
    metadata: {
      title: `Admin Candidate Inspection · ${source.runtimeVariantId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      locale: "zh-CN",
    },
    input: {
      type: "fixture",
      raw: `admin-candidate-inspection:${source.runtimeVariantId}`,
      capturedAt: new Date().toISOString(),
    },
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "style_library_inspection_v0",
      blockOverrides: [{ blockId, variantId: source.runtimeVariantId }],
    },
    blocks: [
      {
        id: blockId,
        type: source.blockType,
        content: fixture.blockContent,
      },
    ],
  });
}
