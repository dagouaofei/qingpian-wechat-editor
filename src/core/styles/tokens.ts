/**
 * Style System token 契约 — ColorTokenRef 与 schemaVersion
 * @see docs/architecture/style-system.md
 */

export const STYLE_SCHEMA_VERSION = 1 as const;

export type StyleSchemaVersion = typeof STYLE_SCHEMA_VERSION;

/** 推荐路径：InlineMark / ResolvedStyle 引用的语义色 token */
export const COLOR_TOKEN_REFS = [
  "text.default",
  "text.muted",
  "text.accent",
  "text.strong",
  "brand.primary",
  "brand.secondary",
] as const;

export type ColorTokenRef = (typeof COLOR_TOKEN_REFS)[number];

const COLOR_TOKEN_REF_SET = new Set<string>(COLOR_TOKEN_REFS);

/** 受控 token ref（推荐路径） */
export function isColorTokenRef(value: string): value is ColorTokenRef {
  return COLOR_TOKEN_REF_SET.has(value);
}

/**
 * 归一 color 输入：token ref 原样返回；其它 string 视为 legacy raw color。
 * Sprint 2 InlineMark.color 仍接受任意 semantic token 名；本 helper 供 Style 层逐步收紧。
 */
export function normalizeColorTokenRef(
  value: string,
): ColorTokenRef | { legacyRaw: string } {
  if (isColorTokenRef(value)) {
    return value;
  }
  return { legacyRaw: value };
}

/** legacy raw color（如 #hex）— 非推荐路径，后续 copy-safe validation 会收紧 */
export function isLegacyRawColor(value: string): boolean {
  return !isColorTokenRef(value);
}
