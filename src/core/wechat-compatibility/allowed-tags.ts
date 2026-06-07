/** Green-list tags for WeChat MP editor compatible output (S10-STORY-011A). */
export const WECHAT_ALLOWED_TAGS = [
  "section",
  "p",
  "span",
  "strong",
  "em",
  "b",
  "i",
  "br",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
] as const;

export const WECHAT_FORBIDDEN_TAGS = [
  "script",
  "style",
  "link",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "video",
  "audio",
  "svg",
  "canvas",
] as const;

export type WechatAllowedTag = (typeof WECHAT_ALLOWED_TAGS)[number];

export function isWechatAllowedTag(tag: string): boolean {
  return (WECHAT_ALLOWED_TAGS as readonly string[]).includes(tag.toLowerCase());
}

export function isWechatForbiddenTag(tag: string): boolean {
  return (WECHAT_FORBIDDEN_TAGS as readonly string[]).includes(tag.toLowerCase());
}
