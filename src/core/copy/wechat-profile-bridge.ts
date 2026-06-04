/**
 * wechat-copy-style-rules.md 文档字段 ↔ 代码 WeChatCompatibilityProfile 结构映射
 * @see docs/architecture/wechat-copy-style-rules.md §3
 * @see docs/architecture/wechat-safe-html-css-contract.md (`wechat-safe-contract-v1`)
 * @see src/core/wechat-compat — Contract v1 machine-readable profile (S8-STORY-003)
 *
 * 文档侧仍使用 allowedCssProperties / riskyCssProperties / forbiddenCssProperties；
 * 代码侧统一为 profile.cssRules.{allowed,risky,forbidden}（green/yellow/red）。
 * 属性分级以 Contract v1 为准；Renderer / Copy 默认读取 WECHAT_SAFE_CONTRACT_V1_PROFILE。
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
