/**
 * Preview / Copy Renderer 共享类型与结果契约
 * @see docs/architecture/rendering-pipeline.md
 */

import type { Block, BlockType } from "@/core/blocks";
import type { Article } from "@/core/article";
import type {
  CopySafety,
  ResolvedArticleStyle,
  ResolvedBlockStyle,
  ResolvedStyleSource,
  SlotContentBinding,
  SlotCopySafety,
  TitleBlockLayoutMode,
  VariantComponentProtocol,
} from "@/core/styles";

export const RENDER_MODES = ["preview", "copy"] as const;

export type RenderMode = (typeof RENDER_MODES)[number];

export const RENDER_TARGETS = ["browser_preview", "wechat_copy"] as const;

export type RenderTarget = (typeof RENDER_TARGETS)[number];

/** Sprint 4-A text-first renderer scope */
export const TEXT_FIRST_RENDERER_BLOCK_TYPES = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "divider",
] as const satisfies readonly BlockType[];

export type TextFirstRendererBlockType =
  (typeof TEXT_FIRST_RENDERER_BLOCK_TYPES)[number];

export const RENDERER_ISSUE_CODES = [
  "missing_resolved_style",
  "unsupported_block_type",
  "unsupported_variant",
  "renderer_not_registered",
  "copy_safety_warning",
  "invalid_renderer_input",
  "missing_component_protocol",
  "optional_slot_disabled",
  "unsafe_inline_color",
  "unsafe_link_href",
] as const;

export type RendererIssueCode = (typeof RENDERER_ISSUE_CODES)[number];

export type RendererIssueSeverity = "error" | "warning" | "info";

export type RendererIssue = {
  severity: RendererIssueSeverity;
  code: RendererIssueCode;
  message: string;
  blockId?: string;
  blockType?: BlockType;
  variantId?: string;
  slotId?: string;
  path?: Array<string | number>;
  details?: Record<string, string | boolean | number>;
};

export type RendererFallbackInfo = {
  applied: boolean;
  reason?: string;
  styleSource?: ResolvedStyleSource;
  fallbackVariantId?: string;
  fallbackSlotId?: string;
};

/** 本轮占位输出；具体 block renderer 使用专用 output 类型 */
export type PreviewRendererOutputPlaceholder = {
  kind: "preview_placeholder";
  blockId: string;
};

export type CopyRendererOutputPlaceholder = {
  kind: "copy_placeholder";
  blockId: string;
};

export type TitleBlockPreviewOutput = {
  kind: "title_block_preview";
  blockId: string;
  blockType: "title" | "heading";
  variantId: string;
  layoutMode: TitleBlockLayoutMode;
  familyId?: string;
  text: string;
  headingLevel?: 1 | 2 | 3;
  presentation: {
    badgeText?: string;
    decorationLabel?: string;
    indexLabel?: string;
    iconAssetId?: string;
    iconGlyph?: string;
    iconCapsuleLabel?: string;
    cardTitleFrame?: boolean;
    cornerAccent?: boolean;
  };
  typography?: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    fontFamily?: string;
    color?: string;
    accentColor?: string;
    mutedColor?: string;
  };
  /** Heading publish pool：与 Copy 相同的 theme palette（避免 Preview 用 CSS 变量近似色） */
  themePalette?: import("@/core/styles/theme-palette-tokens").ThemePaletteTokens;
  slots: Record<
    string,
    {
      state: SlotRenderState;
      content?: string;
      fallbackReason?: string;
    }
  >;
};

export type TitleBlockCopyOutput = {
  kind: "title_block_copy_html";
  blockId: string;
  blockType: "title" | "heading";
  variantId: string;
  layoutMode: TitleBlockLayoutMode;
  html: string;
  copySafety?: CopySafety;
};

export type TextBlockCopyOutput = {
  kind: "text_block_copy_html";
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
  layout: import("./text-block-typography").TextBlockLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type PreviewInlineMark = {
  type: string;
  color?: string;
  href?: string;
  resolvedColor?: string;
  state: "active" | "fallback" | "stripped";
  fallbackReason?: string;
};

export type PreviewInlineNode = {
  text: string;
  marks?: PreviewInlineMark[];
};

export type TextBlockLayoutKind = import("./text-block-typography").TextBlockLayoutKind;

export type TextBlockPreviewOutput = {
  kind: "text_block_preview";
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
  layout: TextBlockLayoutKind;
  nodes: PreviewInlineNode[];
  copySafety?: CopySafety;
};

export type DividerLayoutKind = import("./divider-layout").DividerLayoutKind;

export type DividerPreviewOutput = {
  kind: "divider_preview";
  blockId: string;
  blockType: "divider";
  variantId: string;
  layout: DividerLayoutKind;
  copySafety?: CopySafety;
};

export type DividerCopyOutput = {
  kind: "divider_copy_html";
  blockId: string;
  blockType: "divider";
  variantId: string;
  layout: DividerLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type ListLayoutKind = import("./list-layout").ListLayoutKind;

export type ListPreviewItem = {
  text: string;
  subItems: string[];
  sourceIndex: number;
  marker: string;
};

export type ListPreviewOutput = {
  kind: "list_preview";
  blockId: string;
  blockType: "list";
  variantId: string;
  layout: ListLayoutKind;
  ordered: boolean;
  items: ListPreviewItem[];
  copySafety?: CopySafety;
};

export type ListCopyOutput = {
  kind: "list_copy_html";
  blockId: string;
  blockType: "list";
  variantId: string;
  layout: ListLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type QuoteLayoutKind = import("./quote-layout").QuoteLayoutKind;

export type QuotePreviewOutput = {
  kind: "quote_preview";
  blockId: string;
  blockType: "quote";
  variantId: string;
  layout: QuoteLayoutKind;
  text: string;
  attribution?: string;
  attributionState: SlotRenderState;
  copySafety?: CopySafety;
};

export type QuoteCopyOutput = {
  kind: "quote_copy_html";
  blockId: string;
  blockType: "quote";
  variantId: string;
  layout: QuoteLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type HighlightLayoutKind = import("./highlight-layout").HighlightLayoutKind;

export type HighlightPreviewOutput = {
  kind: "highlight_preview";
  blockId: string;
  blockType: "highlight";
  variantId: string;
  layout: HighlightLayoutKind;
  text: string;
  label?: string;
  labelState: SlotRenderState;
  copySafety?: CopySafety;
};

export type HighlightCopyOutput = {
  kind: "highlight_copy_html";
  blockId: string;
  blockType: "highlight";
  variantId: string;
  layout: HighlightLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type InfoCardLayoutKind = import("./info-card-layout").InfoCardLayoutKind;

export type InfoCardPreviewOutput = {
  kind: "info_card_preview";
  blockId: string;
  blockType: "info_card";
  variantId: string;
  layout: InfoCardLayoutKind;
  title?: string;
  titleState: SlotRenderState;
  body: string;
  bodyLines: string[];
  icon?: string;
  iconState: SlotRenderState;
  copySafety?: CopySafety;
};

export type InfoCardCopyOutput = {
  kind: "info_card_copy_html";
  blockId: string;
  blockType: "info_card";
  variantId: string;
  layout: InfoCardLayoutKind;
  html: string;
  copySafety?: CopySafety;
};

export type CtaLayoutKind = import("./cta-layout").CtaLayoutKind;

export type CtaPreviewOutput = {
  kind: "cta_preview";
  blockId: string;
  blockType: "cta";
  variantId: string;
  layout: CtaLayoutKind;
  text: string;
  action?: string;
  actionState: SlotRenderState;
  placeholderLabel: string;
  copySafety?: CopySafety;
};

export type CtaCopyOutput = {
  kind: "cta_copy_html";
  blockId: string;
  blockType: "cta";
  variantId: string;
  layout: CtaLayoutKind;
  html: string;
  copySafety?: CopySafety;
  placeholderOnly: true;
};

export type ImagePlaceholderLayoutKind =
  import("./image-placeholder-layout").ImagePlaceholderLayoutKind;

export type ImagePlaceholderPreviewOutput = {
  kind: "image_placeholder_preview";
  blockId: string;
  blockType: "image_placeholder";
  variantId: string;
  layout: ImagePlaceholderLayoutKind;
  caption?: string;
  captionState: SlotRenderState;
  suggestion?: string;
  suggestionState: SlotRenderState;
  aspectRatio: string;
  position: string;
  placeholderLabel: string;
  copySafety?: CopySafety;
};

export type ImagePlaceholderCopyOutput = {
  kind: "image_placeholder_copy_html";
  blockId: string;
  blockType: "image_placeholder";
  variantId: string;
  layout: ImagePlaceholderLayoutKind;
  html: string;
  copySafety?: CopySafety;
  placeholderOnly: true;
};

export type RendererOutputPlaceholder =
  | PreviewRendererOutputPlaceholder
  | CopyRendererOutputPlaceholder
  | TitleBlockPreviewOutput
  | TitleBlockCopyOutput
  | TextBlockPreviewOutput
  | TextBlockCopyOutput
  | DividerPreviewOutput
  | DividerCopyOutput
  | ListPreviewOutput
  | ListCopyOutput
  | QuotePreviewOutput
  | QuoteCopyOutput
  | HighlightPreviewOutput
  | HighlightCopyOutput
  | InfoCardPreviewOutput
  | InfoCardCopyOutput
  | CtaPreviewOutput
  | CtaCopyOutput
  | ImagePlaceholderPreviewOutput
  | ImagePlaceholderCopyOutput;

export type RendererResult<TOutput = RendererOutputPlaceholder> = {
  ok: boolean;
  blockId: string;
  blockType: BlockType;
  variantId?: string;
  mode: RenderMode;
  target: RenderTarget;
  output?: TOutput;
  issues: RendererIssue[];
  warnings: RendererIssue[];
  fallback?: RendererFallbackInfo;
};

export type BlockRenderInput = {
  article: Article;
  block: Block;
  resolvedArticleStyle: ResolvedArticleStyle;
  mode: RenderMode;
  target: RenderTarget;
};

export type ResolvedComponentProtocolView = {
  present: boolean;
  componentId?: string;
  familyId?: string;
  layoutMode?: TitleBlockLayoutMode;
  raw?: VariantComponentProtocol;
};

export type SlotRenderState = "active" | "disabled" | "fallback";

export type ResolvedSlotRenderInfo = {
  slotId: string;
  state: SlotRenderState;
  binding: SlotContentBinding;
  copySafety: SlotCopySafety;
  fallbackReason?: string;
};

/** Renderer 消费视图：在 ResolvedBlockStyle 上展开 componentProtocol 与 slot 边界 */
export type ResolvedBlockStyleView = ResolvedBlockStyle & {
  componentProtocol: ResolvedComponentProtocolView;
};

export type BlockRenderContext = {
  article: Article;
  block: Block;
  resolvedArticleStyle: ResolvedArticleStyle;
  resolvedBlockStyle: ResolvedBlockStyleView;
  mode: RenderMode;
  target: RenderTarget;
  slotStates: Record<string, ResolvedSlotRenderInfo>;
  copySafety?: CopySafety;
};

export type BlockRenderer<TOutput = RendererOutputPlaceholder> = {
  readonly blockType: BlockType;
  readonly mode: RenderMode;
  render: (context: BlockRenderContext) => RendererResult<TOutput>;
};

export type RenderBlockOptions = {
  input: BlockRenderInput;
  registry: BlockRendererRegistry;
  /** 默认不限；传入 TEXT_FIRST_RENDERER_BLOCK_TYPES 可启用 Sprint 4-A 范围校验 */
  supportedBlockTypes?: readonly BlockType[];
};

export type RenderArticleBlocksOptions = {
  article: Article;
  resolvedArticleStyle: ResolvedArticleStyle;
  mode: RenderMode;
  target: RenderTarget;
  registry: BlockRendererRegistry;
  supportedBlockTypes?: readonly BlockType[];
};

/** Forward declaration — implemented in registry.ts */
export type BlockRendererRegistry = {
  register: (renderer: BlockRenderer) => void;
  resolve: (blockType: BlockType, mode: RenderMode) => BlockRenderer | undefined;
  has: (blockType: BlockType, mode: RenderMode) => boolean;
  list: () => BlockRenderer[];
};

export function renderTargetForMode(mode: RenderMode): RenderTarget {
  return mode === "preview" ? "browser_preview" : "wechat_copy";
}

export function isTextFirstRendererBlockType(
  blockType: BlockType,
): blockType is TextFirstRendererBlockType {
  return (TEXT_FIRST_RENDERER_BLOCK_TYPES as readonly BlockType[]).includes(
    blockType,
  );
}
