/**
 * Release 1 Block 类型 — 11 种 semantic block
 * @see docs/architecture/block-schema.md
 */

import type { InlineTextInput } from "@/core/article";

export const BLOCK_TYPES = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "divider",
  "image_placeholder",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export type BlockMeta = {
  label?: string;
  sourceIndex?: number;
};

export type TitleBlockContent = {
  text: string;
};

export type LeadBlockContent = {
  text: InlineTextInput;
};

export type HeadingBlockContent = {
  text: string;
  level: 1 | 2 | 3;
};

export type ParagraphBlockContent = {
  text: InlineTextInput;
};

export type ListItemContent = {
  text: string;
  subItems?: string[];
};

export type ListBlockContent = {
  ordered: boolean;
  items: ListItemContent[];
};

export type QuoteBlockContent = {
  text: string;
  attribution?: string;
};

export type HighlightBlockContent = {
  text: string;
  label?: string;
};

export type InfoCardBlockContent = {
  title?: string;
  body: string;
  icon?: string;
};

export type CtaBlockContent = {
  text: string;
  action?: string;
};

export type DividerStyle = "line" | "space" | "dot";

export type DividerBlockContent = {
  style?: DividerStyle;
};

export type ImageAspectRatio = "16:9" | "4:3" | "1:1" | "free";
export type ImagePosition = "full" | "inline";

export type ImagePlaceholderBlockContent = {
  caption?: string;
  aspectRatio?: ImageAspectRatio;
  position?: ImagePosition;
  suggestion?: string;
};

type BlockBase<TType extends BlockType, TContent> = {
  id: string;
  type: TType;
  content: TContent;
  meta?: BlockMeta;
};

export type TitleBlock = BlockBase<"title", TitleBlockContent>;
export type LeadBlock = BlockBase<"lead", LeadBlockContent>;
export type HeadingBlock = BlockBase<"heading", HeadingBlockContent>;
export type ParagraphBlock = BlockBase<"paragraph", ParagraphBlockContent>;
export type ListBlock = BlockBase<"list", ListBlockContent>;
export type QuoteBlock = BlockBase<"quote", QuoteBlockContent>;
export type HighlightBlock = BlockBase<"highlight", HighlightBlockContent>;
export type InfoCardBlock = BlockBase<"info_card", InfoCardBlockContent>;
export type CtaBlock = BlockBase<"cta", CtaBlockContent>;
export type DividerBlock = BlockBase<"divider", DividerBlockContent>;
export type ImagePlaceholderBlock = BlockBase<
  "image_placeholder",
  ImagePlaceholderBlockContent
>;

export type Block =
  | TitleBlock
  | LeadBlock
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | QuoteBlock
  | HighlightBlock
  | InfoCardBlock
  | CtaBlock
  | DividerBlock
  | ImagePlaceholderBlock;
