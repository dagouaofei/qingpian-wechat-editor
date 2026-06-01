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
  renderInlineContentToCopyHtml,
} from "./inline-content-html";
export type { RenderInlineContentCopyResult } from "./inline-content-html";
export {
  copyHtmlUsesInlineStyleOnly,
  renderTitleBlockCopyHtml,
} from "./title-block-copy";
export { renderTextBlockCopyHtml } from "./text-block-copy";

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
