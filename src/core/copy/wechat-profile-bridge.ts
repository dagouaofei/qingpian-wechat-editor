/**
 * wechat-copy-style-rules.md 文档字段 ↔ 代码 WeChatCompatibilityProfile 结构映射
 * @see docs/architecture/wechat-copy-style-rules.md §3
 * @see src/core/styles/types.ts WeChatCompatibilityProfile
 *
 * 文档侧仍使用 allowedCssProperties / riskyCssProperties / forbiddenCssProperties；
 * 代码侧统一为 profile.cssRules.{allowed,risky,forbidden}。
 * Renderer / Copy 层读取 profile 时以代码结构为准，文档字段仅作对照。
 */

export const WECHAT_PROFILE_DOC_FIELD_BRIDGE = {
  allowedCssProperties: "cssRules.allowed",
  riskyCssProperties: "cssRules.risky",
  forbiddenCssProperties: "cssRules.forbidden",
} as const;

export type WeChatProfileDocField = keyof typeof WECHAT_PROFILE_DOC_FIELD_BRIDGE;

export type WeChatProfileCodePath =
  (typeof WECHAT_PROFILE_DOC_FIELD_BRIDGE)[WeChatProfileDocField];

export function mapWeChatProfileDocFieldToCodePath(
  docField: WeChatProfileDocField,
): WeChatProfileCodePath {
  return WECHAT_PROFILE_DOC_FIELD_BRIDGE[docField];
}

/** Copy Renderer 占位输出；S4A-STORY-003+ 替换为 inline HTML fragment */
export type CopyRendererHtmlPlaceholder = {
  kind: "copy_html_placeholder";
  blockId: string;
  /** 预留：微信兼容 HTML 片段，本轮不生成真实 HTML */
  html?: undefined;
};

export type CopyRendererOutput = CopyRendererHtmlPlaceholder;
