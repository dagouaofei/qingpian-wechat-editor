/**
 * InlineContent / InlineMark — Release 1 段内富文本语义协议
 * @see docs/architecture/block-schema.md §3.1
 */

/** InlineMark 受控类型（语义级，非 CSS） */
export type InlineMarkType =
  | "bold"
  | "italic"
  | "highlight"
  | "color"
  | "link";

/** 语义意图分类（非样式 variant） */
export type InlineMarkSemantic =
  | "keyword"
  | "warning"
  | "benefit"
  | "note";

type InlineMarkBase = {
  /** 语义色意图 token 名，非 CSS 值 */
  color?: string;
  semantic?: InlineMarkSemantic;
};

export type InlineMarkBold = InlineMarkBase & { type: "bold" };
export type InlineMarkItalic = InlineMarkBase & { type: "italic" };
export type InlineMarkHighlight = InlineMarkBase & { type: "highlight" };
export type InlineMarkColor = InlineMarkBase & {
  type: "color";
  color: string;
};
export type InlineMarkLink = InlineMarkBase & {
  type: "link";
  href: string;
};

export type InlineMark =
  | InlineMarkBold
  | InlineMarkItalic
  | InlineMarkHighlight
  | InlineMarkColor
  | InlineMarkLink;

export type InlineTextNode = {
  text: string;
  marks?: InlineMark[];
};

/** 段内富文本：有序 text 节点列表（非 HTML 字符串） */
export type InlineContent = InlineTextNode[];

/** paragraph / lead 主文本字段输入形态 */
export type InlineTextInput = string | InlineContent;

/** 文档兼容期：旧 emphasis 字段 */
export type LegacyEmphasis = "bold" | "italic";
