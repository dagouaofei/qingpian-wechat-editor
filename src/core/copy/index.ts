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
export {
  validateWechatCopyHtml,
  type ValidateWechatCopyHtmlInput,
  type WechatCopyValidationResult,
} from "@/core/wechat-compat";
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
  assertCtaCopySafeCss,
  copyHtmlUsesInlineStyleOnly as ctaCopyHtmlUsesInlineStyleOnly,
  renderCtaCopyHtml,
} from "./cta-copy";
export {
  assertImagePlaceholderCopySafeCss,
  copyHtmlUsesInlineStyleOnly as imagePlaceholderCopyHtmlUsesInlineStyleOnly,
  renderImagePlaceholderCopyHtml,
} from "./image-placeholder-copy";
export {
  createSprint4ATextFirstCopyRendererRegistry,
  SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES,
} from "./text-first-copy-registry";
export type { Sprint4ATextFirstCopyBlockType } from "./text-first-copy-registry";
export {
  createSprint4BStructuredCopyRendererRegistry,
  SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
} from "./structured-copy-registry";
export type { Sprint4BStructuredCopyBlockType } from "./structured-copy-registry";
export {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "./first-wave-copy-registry";
export type { Release1FirstWaveCopyBlockType } from "./first-wave-copy-registry";
export {
  buildRelease1FirstWavePasteQaPlan,
  RELEASE1_FIRST_WAVE_VARIANT_GROUPS,
} from "./first-wave-paste-qa-plan";
export type {
  FirstWavePasteQaPlanEntry,
  FirstWavePasteQaStatus,
  PasteQaScope,
  RendererCoverageStatus,
} from "./first-wave-paste-qa-plan";
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
