import type { BlockType } from "@/core/blocks";
import type { CopySafety } from "@/core/styles/types";

export const ARTICLE_DSL_VERSION = "s10.article-dsl.v1" as const;
export const VARIANT_DSL_VERSION = "s10.variant-dsl.v1" as const;

export type DslRenderTarget = "preview" | "copy_wechat" | "admin_inspection" | "qa_snapshot";

export type DslStyleValue = string | number;

export type DslStyle = Record<string, DslStyleValue>;

export type DslElementNode = {
  type: "element";
  tag: string;
  style?: DslStyle;
  children?: DslNode[];
};

export type DslSlotNode = {
  type: "slot";
  slot: string;
  tag?: string;
  style?: DslStyle;
};

export type DslTextNode = {
  type: "text";
  value: string;
};

export type DslNode = DslElementNode | DslSlotNode | DslTextNode;

export type DslSlotBinding = {
  role: string;
  required?: boolean;
};

export type VariantRenderContract =
  | "title_block_v1"
  | "text_block_v1"
  | "info_card_v1"
  | "list_block_v1"
  | "quote_block_v1"
  | "highlight_block_v1"
  | "cta_block_v1"
  | "divider_block_v1"
  | "image_placeholder_v1";

export type VariantDslV1 = {
  version: typeof VARIANT_DSL_VERSION;
  id: string;
  blockType: BlockType;
  label?: string;
  family?: string;
  copySafety: CopySafety;
  tree?: DslNode;
  renderContract?: VariantRenderContract;
  tokens?: Record<string, string>;
  slots?: Record<string, DslSlotBinding>;
  componentProtocol?: Record<string, unknown>;
  compatibility?: Record<string, unknown>;
  meta?: Record<string, unknown>;
};

export type ArticleDslBlockRef = {
  blockId: string;
  blockType: BlockType;
  content: Record<string, unknown>;
  styleRef: {
    runtimeVariantId: string;
  };
};

export type ArticleDslV1 = {
  version: typeof ARTICLE_DSL_VERSION;
  blocks: ArticleDslBlockRef[];
};

export type DslValidationIssue = {
  code: string;
  message: string;
  path?: string;
};

export type DslValidationResult = {
  valid: boolean;
  issues: DslValidationIssue[];
};
