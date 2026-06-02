import type { Article } from "@/core/article";
import type { BlockType } from "@/core/blocks";
import type { ResolvedArticleStyle } from "@/core/styles";
import type { BlockRendererRegistry, RendererIssue } from "@/core/renderer";

import {
  buildCopyHtmlSnapshot,
  type CopyHtmlSnapshotEntry,
} from "./copy-html-snapshot";
import { buildArticlePlainText } from "./plain-text";

export type ClipboardPayload = {
  textHtml: string;
  textPlain: string;
  issues: RendererIssue[];
  warnings: RendererIssue[];
  metadata: {
    articleId: string;
    mimeTypes: ["text/html", "text/plain"];
    blockCount: number;
    snapshotEntryCount: number;
    variantIds: string[];
    source: "copy_renderer";
  };
};

export type BuildClipboardPayloadOptions = {
  article: Article;
  resolvedArticleStyle: ResolvedArticleStyle;
  registry?: BlockRendererRegistry;
  supportedBlockTypes?: readonly BlockType[];
};

function joinSnapshotHtml(entries: CopyHtmlSnapshotEntry[]): string {
  return entries.map((entry) => entry.html).join("\n");
}

export function buildClipboardPayload(
  options: BuildClipboardPayloadOptions,
): ClipboardPayload {
  const snapshot = buildCopyHtmlSnapshot(options);
  const textPlain = buildArticlePlainText(options.article);

  return {
    textHtml: joinSnapshotHtml(snapshot.entries),
    textPlain,
    issues: snapshot.issues,
    warnings: snapshot.warnings,
    metadata: {
      articleId: options.article.id,
      mimeTypes: ["text/html", "text/plain"],
      blockCount: options.article.blocks.length,
      snapshotEntryCount: snapshot.entries.length,
      variantIds: snapshot.metadata.variantIds,
      source: snapshot.metadata.source,
    },
  };
}
