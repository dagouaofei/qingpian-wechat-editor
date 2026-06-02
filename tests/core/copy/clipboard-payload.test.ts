import { describe, expect, it, vi } from "vitest";

import { buildClipboardPayload } from "@/core/copy";
import {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy/first-wave-copy-registry";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createStructuredCopyArticleFixture,
  STRUCTURED_COPY_STYLE_REGISTRY,
} from "../../fixtures/copy/structured-copy-fixtures";
import {
  createTextFirstCopyArticleFixture,
  TEXT_FIRST_COPY_STYLE_REGISTRY,
} from "../../fixtures/copy/text-first-copy-fixtures";

describe("clipboard payload builder", () => {
  const styleRegistry = parseStyleRegistry(TEXT_FIRST_COPY_STYLE_REGISTRY);

  it("returns text/html and text/plain payload without calling Clipboard API", () => {
    const write = vi.fn(() => {
      throw new Error("Clipboard API must not be called in core builder");
    });
    vi.stubGlobal("navigator", { clipboard: { write } });

    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const payload = buildClipboardPayload({
      article,
      resolvedArticleStyle: resolved,
    });

    expect(payload.issues).toEqual([]);
    expect(payload.textHtml).toContain("<section");
    expect(payload.textHtml).toContain("style=");
    expect(payload.textPlain).toContain("轻篇复制快照标题");
    expect(payload.metadata.mimeTypes).toEqual(["text/html", "text/plain"]);
    expect(payload.metadata.snapshotEntryCount).toBe(6);
    expect(write).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("keeps text/plain free from html tags", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const payload = buildClipboardPayload({
      article,
      resolvedArticleStyle: resolved,
    });

    expect(payload.textPlain).not.toMatch(/<[^>]*>/);
    expect(payload.textPlain).toContain("正文包含 加粗、高亮 与 安全链接。");
  });

  it("supports Release 1 first-wave structured blocks including cta", () => {
    const styleRegistry = parseStyleRegistry(STRUCTURED_COPY_STYLE_REGISTRY);
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const payload = buildClipboardPayload({
      article,
      resolvedArticleStyle: resolved,
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
    });

    expect(payload.issues).toEqual([]);
    expect(payload.metadata.snapshotEntryCount).toBe(article.blocks.length);
    expect(payload.textHtml).toContain("style=");
  });
});
