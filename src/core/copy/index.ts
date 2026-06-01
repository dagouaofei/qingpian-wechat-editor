export type { CopyRendererHtmlPlaceholder, CopyRendererOutput } from "./wechat-profile-bridge";

export {
  WECHAT_PROFILE_DOC_FIELD_BRIDGE,
  mapWeChatProfileDocFieldToCodePath,
} from "./wechat-profile-bridge";

export type {
  WeChatProfileCodePath,
  WeChatProfileDocField,
} from "./wechat-profile-bridge";

export { escapeHtml, escapeHtmlAttribute, assertCopySafeHtml } from "./html-escape";
export { buildInlineStyle, wrapInlineElement } from "./inline-style";
export type { InlineStyleRecord } from "./inline-style";
export {
  assertCopySafeHtmlSnapshot,
  collectCopySafeHtmlViolations,
  isCopySafeHtmlSnapshot,
} from "./copy-safe-html";
export type {
  CopySafeHtmlViolation,
  CopySafeHtmlViolationCode,
} from "./copy-safe-html";
export {
  renderInlineContentToCopyHtml,
} from "./inline-content-html";
export type { RenderInlineContentCopyResult } from "./inline-content-html";
export {
  copyHtmlUsesInlineStyleOnly,
  renderTitleBlockCopyHtml,
} from "./title-block-copy";
export { renderTextBlockCopyHtml } from "./text-block-copy";
export {
  assertDividerCopySafeCss,
  copyHtmlUsesInlineStyleOnly as dividerCopyHtmlUsesInlineStyleOnly,
  renderDividerCopyHtml,
} from "./divider-copy";
export {
  assertListCopySafeCss,
  copyHtmlUsesInlineStyleOnly as listCopyHtmlUsesInlineStyleOnly,
  renderListCopyHtml,
} from "./list-copy";
export {
  assertQuoteCopySafeCss,
  copyHtmlUsesInlineStyleOnly as quoteCopyHtmlUsesInlineStyleOnly,
  renderQuoteCopyHtml,
} from "./quote-copy";
export {
  assertHighlightCopySafeCss,
  copyHtmlUsesInlineStyleOnly as highlightCopyHtmlUsesInlineStyleOnly,
  renderHighlightCopyHtml,
} from "./highlight-copy";
export {
  assertInfoCardCopySafeCss,
  copyHtmlUsesInlineStyleOnly as infoCardCopyHtmlUsesInlineStyleOnly,
  renderInfoCardCopyHtml,
} from "./info-card-copy";
export {
  createSprint4ATextFirstCopyRendererRegistry,
  SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES,
} from "./text-first-copy-registry";
export type { Sprint4ATextFirstCopyBlockType } from "./text-first-copy-registry";
export { buildCopyHtmlSnapshot } from "./copy-html-snapshot";
export type {
  BuildCopyHtmlSnapshotOptions,
  CopyHtmlSnapshot,
  CopyHtmlSnapshotEntry,
} from "./copy-html-snapshot";
export { buildArticlePlainText, blockToPlainText, inlineTextInputToPlainText } from "./plain-text";
export { buildClipboardPayload } from "./clipboard-payload";
export type {
  BuildClipboardPayloadOptions,
  ClipboardPayload,
} from "./clipboard-payload";
export {
  PASTE_QA_STATUSES,
  SPRINT4A_TEXT_FIRST_PASTE_QA_SEED,
} from "./paste-qa-seed";
export type { PasteQaSeedRecord, PasteQaStatus } from "./paste-qa-seed";

/** Copy 路径复用 Preview 共享 Renderer 契约；Copy 专属类型见本模块 */
export type {
  BlockRenderContext,
  BlockRenderInput,
  BlockRenderer,
  BlockRendererRegistry,
  RenderMode,
  RenderTarget,
  RendererIssue,
  RendererResult,
  ResolvedBlockStyleView,
} from "@/core/renderer";

export {
  RENDER_MODES,
  TEXT_FIRST_RENDERER_BLOCK_TYPES,
  createBlockRendererRegistry,
  createRendererIssue,
  enrichResolvedBlockStyleForRenderer,
  renderArticleBlocks,
  renderBlock,
  renderTargetForMode,
  resolveRendererOrIssue,
  validateBlockRenderInput,
} from "@/core/renderer";

export { BlockRendererRegistryError } from "@/core/renderer";
