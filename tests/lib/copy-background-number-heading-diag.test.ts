import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";
import {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy/first-wave-copy-registry";
import { collectCopySafeHtmlViolations } from "@/core/copy/copy-safe-html";
import { buildCopyHtmlSnapshot } from "@/core/copy/copy-html-snapshot";
import { resolveRuntimePoolDefinitionFromMeta } from "@/lib/dsl-runtime/resolve-runtime-pool-definition";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import {
  applyHeadingVariantToArticle,
} from "@/lib/preview-heading-style";
import { applyPreviewThemeToArticle } from "@/lib/preview-style-controls";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";
import { renderUserPreviewBlock } from "@/lib/user-preview-render";
import { resolveArticleStyle } from "@/core/styles";
import { renderTargetForMode } from "@/core/renderer";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";
import { BACKGROUND_NUMBER_HEADING_HTML } from "../fixtures/dsl/background-number-heading-html";

const RUNTIME_VARIANT_ID = "heading_html_paste_4933bb91_candidate";

function buildResolvedRuntime() {
  const encoded = encodeHtmlToVariantDsl({
    html: BACKGROUND_NUMBER_HEADING_HTML,
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading",
    wechatCompatibilityMode: "off",
  });
  if (!encoded.ok) throw new Error("encode failed");

  const stale = {
    ...encoded.value,
    tree: {
      type: "element" as const,
      tag: "section",
      style: {
        paddingTop: "10px",
        borderLeftColor: "#1677ff",
        borderLeftStyle: "solid",
        borderLeftWidth: "4px",
      },
      children: [
        {
          type: "slot" as const,
          slot: "title",
          tag: "span",
          style: { fontSize: "84px", backgroundColor: "#E60012" },
        },
      ],
    },
  };

  const sourceMeta = {
    blockType: "heading" as const,
    styleFamily: "htmlPaste",
    label: "Background Number Heading",
    primarySourceType: "html_paste",
    sourceHtml: BACKGROUND_NUMBER_HEADING_HTML,
  };

  const resolvedDefinitionJson = resolveRuntimePoolDefinitionFromMeta(
    stale,
    RUNTIME_VARIANT_ID,
    sourceMeta,
  );

  return {
    dslRuntime: {
      source: "database" as const,
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
      definitionJsonByVariantId: { [RUNTIME_VARIANT_ID]: resolvedDefinitionJson },
      variantIds: [RUNTIME_VARIANT_ID],
      issues: [],
    },
    userSelectablePool: {
      source: "database" as const,
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
      variants: [
        {
          id: RUNTIME_VARIANT_ID,
          schemaVersion: "1.0",
          blockType: "heading",
          family: "htmlPaste",
          name: RUNTIME_VARIANT_ID,
          label: "Background Number Heading",
          status: "experimental",
          componentProtocol: {
            componentId: TITLE_BLOCK_COMPONENT_ID,
            familyId: "htmlPaste",
            layoutMode: "pill",
          },
        },
      ],
      poolVariantIds: [RUNTIME_VARIANT_ID],
      issues: [],
    },
  };
}

describe("copy background number heading diagnostic", () => {
  it("includes heading html in clipboard snapshot when copy decode succeeds", () => {
    const { dslRuntime, userSelectablePool } = buildResolvedRuntime();
    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: RUNTIME_VARIANT_ID,
      },
      { dslRuntime, userSelectablePool },
    );

    expect(rendered.clipboard.issueCount).toBeGreaterThan(0);

    const themed = applyPreviewThemeToArticle(
      applyHeadingVariantToArticle(styleSelectionArticleFixture, RUNTIME_VARIANT_ID),
      "businessBlue",
    );
    const registry = createUserPreviewStyleRegistry({
      dbUserSelectableVariants: userSelectablePool.variants,
      preferDatabaseVariants: true,
    });
    const resolved = resolveArticleStyle(themed, registry);
    const headingBlock = themed.blocks.find((block) => block.type === "heading")!;
    const headingCopy = renderUserPreviewBlock({
      input: {
        article: themed,
        block: headingBlock,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: renderTargetForMode("copy"),
      },
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      dslRuntime,
    });

    expect(headingCopy.ok, JSON.stringify(headingCopy.issues)).toBe(true);
    if (headingCopy.ok && headingCopy.output && "html" in headingCopy.output) {
      expect(headingCopy.output.html).toMatch(/<h2\b/i);
      expect(headingCopy.output.html).toContain("章节标题");
      expect(collectCopySafeHtmlViolations(headingCopy.output.html)).toEqual([]);
    }

    const snapshot = buildCopyHtmlSnapshot({
      article: applyHeadingVariantToArticle(styleSelectionArticleFixture, RUNTIME_VARIANT_ID),
      resolvedArticleStyle: resolveArticleStyle(
        applyHeadingVariantToArticle(styleSelectionArticleFixture, RUNTIME_VARIANT_ID),
        createUserPreviewStyleRegistry({
          dbUserSelectableVariants: userSelectablePool.variants,
          preferDatabaseVariants: true,
        }),
      ),
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      renderBlockFn: (renderOptions) =>
        renderUserPreviewBlock({ ...renderOptions, dslRuntime }),
    });
    const headingSnapshotIssues = snapshot.issues.filter(
      (issue) => issue.blockType === "heading",
    );
    expect(headingSnapshotIssues, JSON.stringify(headingSnapshotIssues)).toEqual([]);

    const headingInClipboard = rendered.clipboard.textHtml.match(/<h2\b/i);
    expect(headingInClipboard, rendered.clipboard.textHtml).not.toBeNull();
  });

  it("normalizes flex display for copy snapshot on fidelity tree headings", () => {
    const { dslRuntime, userSelectablePool } = buildResolvedRuntime();
    const definitionJson = dslRuntime.definitionJsonByVariantId[RUNTIME_VARIANT_ID] as {
      tree?: { style?: Record<string, unknown> };
    };
    const flexDefinitionJson = {
      ...definitionJson,
      tree: definitionJson.tree
        ? {
            ...definitionJson.tree,
            style: {
              ...definitionJson.tree.style,
              display: "flex",
            },
          }
        : definitionJson.tree,
    };
    const flexRuntime = {
      ...dslRuntime,
      definitionJsonByVariantId: {
        ...dslRuntime.definitionJsonByVariantId,
        [RUNTIME_VARIANT_ID]: flexDefinitionJson,
      },
    };

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: RUNTIME_VARIANT_ID,
      },
      { dslRuntime: flexRuntime, userSelectablePool },
    );

    expect(rendered.clipboard.textHtml).toMatch(/<h2\b/i);
    expect(rendered.clipboard.textHtml).not.toMatch(/display\s*:\s*flex/i);
  });

  it("records snapshot entry when heading copy render succeeds", () => {
    const { dslRuntime, userSelectablePool } = buildResolvedRuntime();
    const article = applyPreviewThemeToArticle(
      applyHeadingVariantToArticle(styleSelectionArticleFixture, RUNTIME_VARIANT_ID),
      "businessBlue",
    );
    const resolved = resolveArticleStyle(
      article,
      createUserPreviewStyleRegistry({
        dbUserSelectableVariants: userSelectablePool.variants,
        preferDatabaseVariants: true,
      }),
    );
    const headingBlock = article.blocks.find((block) => block.type === "heading")!;

    const copyResult = renderUserPreviewBlock({
      input: {
        article,
        block: headingBlock,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: renderTargetForMode("copy"),
      },
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      dslRuntime,
    });

    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      renderBlockFn: () => copyResult,
    });

    expect(copyResult.ok, JSON.stringify(copyResult.issues)).toBe(true);
    expect(snapshot.entries.some((entry) => entry.blockType === "heading")).toBe(true);
  });
});
