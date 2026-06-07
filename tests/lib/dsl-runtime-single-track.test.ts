import { describe, expect, it, vi } from "vitest";

import { encodeHtmlToVariantDsl, encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import * as renderBlockModule from "@/core/renderer/render-block";
import { headingShortLine } from "@/core/styles/variants/miaopian-heading-variants";
import { headingTealSectionLabelHtmlPasteCandidate } from "@/core/styles/variants/html-paste-candidate-variants";
import { inspectCandidatePreview } from "@/server/style-admin/inspection/candidate-preview-inspector";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import { TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";
import { renderUserPreviewBlock } from "@/lib/user-preview-render";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import {
  buildDatabaseDslRuntimeFixture,
  USER_SELECTABLE_HEADING_IDS_FOR_TESTS,
} from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  renderTargetForMode,
} from "@/core/renderer";
import { resolveArticleStyle } from "@/core/styles";
import { applyPreviewThemeToArticle } from "@/lib/preview-style-controls";
import { applyHeadingVariantToArticle } from "@/lib/preview-heading-style";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";

describe("S10-STORY-011A FIX-A single-track DSL runtime", () => {
  const databaseDslRuntime = buildDatabaseDslRuntimeFixture();

  it("uses DSL Decoder for release1 seed heading when database runtime is available", () => {
    const renderBlockSpy = vi.spyOn(renderBlockModule, "renderBlock");

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "business", colorPalette: "businessBlue", headingVariantId: "" },
      { dslRuntime: databaseDslRuntime },
    );

    const headingBlocks = rendered.previewBlocks.filter((block) => block.blockType === "heading");
    expect(headingBlocks.length).toBeGreaterThan(0);
    expect(headingBlocks.every((block) => block.ok)).toBe(true);
    expect(renderBlockSpy).not.toHaveBeenCalled();
    renderBlockSpy.mockRestore();
  });

  it("does not call renderBlock from user-preview-render when database DSL runtime is set", () => {
    const renderBlockSpy = vi.spyOn(renderBlockModule, "renderBlock");
    const article = applyPreviewThemeToArticle(styleSelectionArticleFixture, "businessBlue");
    const styled = applyHeadingVariantToArticle(article, headingShortLine.id);
    const registry = createUserPreviewStyleRegistry();
    const resolved = resolveArticleStyle(styled, registry);
    const headingBlock = styled.blocks.find((block) => block.type === "heading")!;

    const result = renderUserPreviewBlock({
      input: {
        article: styled,
        block: headingBlock,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: renderTargetForMode("preview"),
      },
      registry: createRelease1FirstWavePreviewRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
      dslRuntime: databaseDslRuntime,
    });

    expect(result.ok).toBe(true);
    expect(renderBlockSpy).not.toHaveBeenCalled();
    renderBlockSpy.mockRestore();
  });

  it("decodes all userSelectable heading variants via DSL preview and copy", () => {
    for (const variantId of USER_SELECTABLE_HEADING_IDS_FOR_TESTS) {
      const preview = renderArticlePreviewClient(
        styleSelectionArticleFixture,
        styleSelectionNormalizedInput,
        {
          articleStyle: "business",
          colorPalette: "businessBlue",
          headingVariantId: variantId,
        },
        { dslRuntime: databaseDslRuntime },
      );

      const heading = preview.previewBlocks.find((block) => block.blockType === "heading");
      expect(heading?.ok, `preview failed for ${variantId}`).toBe(true);
      expect(heading?.variantId).toBe(variantId);
      expect(preview.clipboard.textHtml.length).toBeGreaterThan(0);
    }
  });

  it("renders promoted html_paste heading via database DSL runtime", () => {
    const runtimeVariantId = "heading_html_paste_9776cdde_candidate";
    const encoded = encodeHtmlToVariantDsl({
      html: `<section style="padding:8px 0;border-left:4px solid #1677ff"><span style="font-size:18px;font-weight:700">测试小标题</span></section>`,
      runtimeVariantId,
      blockType: "heading",
      label: "Promoted",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const dslRuntime = buildDatabaseDslRuntimeFixture({
      [runtimeVariantId]: encoded.value,
    });

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: runtimeVariantId,
      },
      {
        dslRuntime,
        userSelectablePool: {
          source: "database",
          cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
          variants: [
            {
              id: runtimeVariantId,
              schemaVersion: "1.0",
              blockType: "heading",
              family: "htmlPaste",
              name: runtimeVariantId,
              label: "Promoted",
              status: "experimental",
            },
          ],
          poolVariantIds: [runtimeVariantId],
          issues: [],
        },
      },
    );

    const heading = rendered.previewBlocks.find((block) => block.blockType === "heading");
    expect(heading?.ok).toBe(true);
    expect(heading?.variantId).toBe(runtimeVariantId);
    expect(rendered.clipboard.textHtml.length).toBeGreaterThan(0);
  });

  it("admin inspection and user preview share DSL decoder core for heading candidate", () => {
    const runtimeVariantId = "heading_html_paste_shared_decoder_candidate";
    const encoded = encodeRegistryVariantToDsl(headingTealSectionLabelHtmlPasteCandidate);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const source: DbCandidateInspectionSource = {
      variantId: "variant-shared",
      runtimeVariantId,
      blockType: "heading",
      styleFamily: "htmlPasteCandidate",
      label: "Shared decoder",
      lifecycle: "candidate",
      definitionJson: encoded.value,
      componentProtocolJson: {
        componentId: TITLE_BLOCK_COMPONENT_ID,
        familyId: "htmlPasteCandidate",
        layoutMode: "pill",
      },
      compatibilityJson: { copySafety: "strict" },
      copySafety: "strict",
      qualityStatus: "validator_pass",
      versionId: "version-shared",
      versionNumber: 1,
      primarySourceType: "html_paste",
      hasRawHtml: false,
    };

    const fixture = buildCandidateInspectionFixture("heading", runtimeVariantId)!;
    const adminPreview = inspectCandidatePreview(source, fixture);
    expect(adminPreview.ok).toBe(true);
    expect(adminPreview.usedAdminFallback).toBe(false);

    const dslRuntime = buildDatabaseDslRuntimeFixture({
      [runtimeVariantId]: encoded.value,
    });
    const userPreview = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: runtimeVariantId,
      },
      {
        dslRuntime,
        userSelectablePool: {
          source: "database",
          cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
          variants: [
            {
              id: runtimeVariantId,
              schemaVersion: "1.0",
              blockType: "heading",
              family: "htmlPasteCandidate",
              name: runtimeVariantId,
              label: "Shared decoder",
              status: "experimental",
              componentProtocol: {
                componentId: TITLE_BLOCK_COMPONENT_ID,
                familyId: "htmlPasteCandidate",
                layoutMode: "pill",
              },
            },
          ],
          poolVariantIds: [runtimeVariantId],
          issues: [],
        },
      },
    );

    const heading = userPreview.previewBlocks.find((block) => block.blockType === "heading");
    expect(heading?.ok).toBe(true);
    expect(adminPreview.outputKind).toBe("title_block_preview");
    expect(heading?.output?.kind).toBe("title_block_preview");
  });
});
