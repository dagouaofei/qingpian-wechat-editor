/**
 * Style System 基础类型 — Theme / Preset / VariantDefinition / StyleRegistry
 * @see docs/architecture/style-system.md
 */

import type { BlockType } from "@/core/blocks";
import type { BlockStyleOverride } from "@/core/article";

import type { ColorTokenRef, StyleSchemaVersion } from "./tokens";

export type { ColorTokenRef, StyleSchemaVersion };
export { COLOR_TOKEN_REFS, STYLE_SCHEMA_VERSION } from "./tokens";

export type ThemeTokenMap = Record<string, string>;

export type ThemeTokens = {
  color?: ThemeTokenMap;
  fontSize?: ThemeTokenMap;
  fontWeight?: ThemeTokenMap;
  lineHeight?: ThemeTokenMap;
  spacing?: ThemeTokenMap;
  radius?: ThemeTokenMap;
  borderWidth?: ThemeTokenMap;
};

export type ThemeDefinition = {
  id: string;
  name: string;
  schemaVersion: StyleSchemaVersion;
  tokens: ThemeTokens;
};

export type Density = "compact" | "standard" | "relaxed";

export type PresetDefinition = {
  id: string;
  name: string;
  schemaVersion: StyleSchemaVersion;
  themeId: string;
  description?: string;
  defaultVariantByBlockType?: Partial<Record<BlockType, string>>;
  /** Allowed variant ids per block for Gallery / orchestration pools */
  variantPoolsByBlockType?: Partial<Record<BlockType, string[]>>;
  /** Subset of theme ids recommended for this preset (defaults still from themeId) */
  recommendedThemeIds?: string[];
  density?: Density;
  tone?: string;
};

export type VariantStatus =
  | "release1_required"
  | "release1_candidate"
  | "experimental";

export type CopySafety = "strict" | "balanced" | "preview_only";

export const TITLE_BLOCK_LAYOUT_MODES = [
  "plain",
  "left_bar",
  "bottom_line",
  "top_badge",
  "numbered",
  "underline",
  "pill",
  "keynote_bar",
  "highlight_marker",
  "short_line",
  "minimal_number",
  "card",
  "quote_mark",
  "icon_prefix",
  "magazine_left_bar",
  "magazine_offset",
  "overlay",
  "offset_background",
] as const;

export type TitleBlockLayoutMode = (typeof TITLE_BLOCK_LAYOUT_MODES)[number];

export const SLOT_ROLES = [
  "title",
  "subtitle",
  "badge",
  "icon",
  "decoration",
  "body",
  "items",
  "action",
  "image",
  "divider",
] as const;

export type SlotRole = (typeof SLOT_ROLES)[number];

export const SLOT_CONTENT_BINDING_SOURCES = [
  "block.content.text",
  "block.content.title",
  "block.content.items",
  "block.content.summary",
  "block.content.body",
  "block.content.action",
  "block.content.image",
  "block.content.caption",
  "block.content.suggestion",
  "block.meta",
  "variant.presentation",
  "assetRegistry",
  "disabled",
] as const;

export type SlotContentBindingSource =
  (typeof SLOT_CONTENT_BINDING_SOURCES)[number];

export type SlotContentBinding = {
  source: SlotContentBindingSource;
  required?: boolean;
  fallback?: string;
};

export type SlotCopySafety = {
  copySafety: CopySafety;
  allowedInCopy: boolean;
  fallbackSlotId?: string;
  notes?: string;
};

export type SlotDefinition = {
  id: string;
  role: SlotRole;
  label?: string;
  binding: SlotContentBinding;
  copySafety: SlotCopySafety;
};

/** Roles that carry primary block body semantics in copy path */
export const BODY_CONTENT_SLOT_ROLES = ["title", "body", "items"] as const;

export type BodyContentSlotRole = (typeof BODY_CONTENT_SLOT_ROLES)[number];

export const TITLE_BLOCK_FIRST_WAVE_ALLOWED_LAYOUT_MODES = [
  "plain",
  "left_bar",
  "bottom_line",
  "top_badge",
  "numbered",
  "underline",
  "pill",
  "keynote_bar",
  "highlight_marker",
  "short_line",
  "minimal_number",
  "icon_prefix",
  "magazine_left_bar",
  "magazine_offset",
  "card",
  "quote_mark",
] as const satisfies readonly TitleBlockLayoutMode[];

export type TitleBlockCatalogLayoutMapping = {
  catalogName: string;
  canonicalLayoutMode: TitleBlockLayoutMode;
  allowedInRelease1Required: boolean;
  fallbackLayoutMode?: TitleBlockLayoutMode;
  note?: string;
};

/** @deprecated Use SlotDefinition — kept for import compatibility */
export type VariantSlotDefinition = SlotDefinition;

export type TitleBlockLayoutRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "forbidden";

export type TitleBlockLayoutCompatibility = {
  layoutMode: TitleBlockLayoutMode;
  allowedInCopy: boolean;
  riskLevel: TitleBlockLayoutRiskLevel;
  fallbackLayoutMode?: TitleBlockLayoutMode;
  allowedCopySafety: CopySafety[];
  allowedVariantStatus: VariantStatus[];
  notes?: string;
};

export type TitleBlockLayoutCompatibilityTable = Record<
  TitleBlockLayoutMode,
  TitleBlockLayoutCompatibility
>;

export type ValidateTitleBlockLayoutOptions = {
  copySafety?: CopySafety;
};

export const TITLE_BLOCK_COMPONENT_ID = "titleBlock";

export type VariantComponentProtocol = {
  componentId?: string;
  familyId?: string;
  layoutMode?: TitleBlockLayoutMode;
};

export type VariantWeChatCompatibility = {
  allowedCssProperties?: string[];
  riskyCssProperties?: string[];
  forbiddenCssProperties?: string[];
  fallbackVariantId?: string;
  notes?: string;
};

export type VariantCompatibility = {
  copySafety?: CopySafety;
  wechat?: VariantWeChatCompatibility;
};

export type VariantDefinition = {
  id: string;
  schemaVersion: StyleSchemaVersion;
  blockType: BlockType;
  family: string;
  name: string;
  label: string;
  description?: string;
  status: VariantStatus;
  slots?: Record<string, SlotDefinition>;
  /** variant 级 token override；value 为 token 名或字面量，不含 HTML/CSS selector */
  tokens?: Record<string, string>;
  compatibility?: VariantCompatibility;
  componentProtocol?: VariantComponentProtocol;
  metadata?: Record<string, string | number | boolean>;
};

export type WeChatCompatibilityTarget = "wechat_mp_editor";

export type ForbiddenCssFallbackAction =
  | "reject"
  | "fallback_variant"
  | "strip_property";

export type RiskyCssFallbackAction = "warn" | "fallback_variant" | "allow";

export type FallbackPolicy = {
  onForbiddenCss: ForbiddenCssFallbackAction;
  onRiskyCss: RiskyCssFallbackAction;
  defaultFallbackVariantId?: string;
  previewOnlyAllowed: boolean;
  notes?: string;
};

export type WeChatCssRules = {
  allowed: string[];
  risky: string[];
  forbidden: string[];
};

export type WeChatCompatibilityProfile = {
  id: string;
  name: string;
  schemaVersion: StyleSchemaVersion;
  target: WeChatCompatibilityTarget;
  cssRules: WeChatCssRules;
  fallbackPolicy: FallbackPolicy;
  notes?: string;
};

export type CssCompatibilityLevel =
  | "allowed"
  | "risky"
  | "forbidden"
  | "unknown";

export type CompatibilityIssue = {
  code: string;
  message: string;
  level: CssCompatibilityLevel;
  severity: "error" | "warning";
  property?: string;
  value?: string;
};

export type CssCompatibilityResult = {
  ok: boolean;
  level: CssCompatibilityLevel;
  issues: CompatibilityIssue[];
  property?: string;
  value?: string;
  message?: string;
};

export type WeChatCompatibilityCheckResult = {
  ok: boolean;
  issues: CompatibilityIssue[];
  variantId: string;
  copySafety?: CopySafety;
  blocking: boolean;
};

export type StyleValidationSeverity = "error" | "warning" | "info";

export type StyleValidationIssue = {
  severity: StyleValidationSeverity;
  code: string;
  message: string;
  path?: Array<string | number>;
  blockId?: string;
  blockType?: BlockType;
  variantId?: string;
  property?: string;
  value?: string;
  fallbackVariantId?: string;
};

export type StyleValidationResult = {
  ok: boolean;
  issues: StyleValidationIssue[];
};

export type MissingVariantFallbackAction =
  | "error"
  | "fallback_to_preset"
  | "fallback_to_registry_default";

export type BlockTypeMismatchFallbackAction =
  | "error"
  | "fallback_to_preset"
  | "fallback_to_registry_default";

export type ForbiddenCssPolicyAction =
  | "error"
  | "fallback_variant"
  | "strip_property";

export type RiskyCssPolicyAction = "warning" | "fallback_variant" | "allow";

export type FallbackVariantPolicy = {
  onMissingVariant: MissingVariantFallbackAction;
  onBlockTypeMismatch: BlockTypeMismatchFallbackAction;
  onForbiddenCss: ForbiddenCssPolicyAction;
  onRiskyCss: RiskyCssPolicyAction;
  allowExperimentalFallback: boolean;
  allowPreviewOnlyInCopy: boolean;
  defaultFallbackVariantId?: string;
};

export type ValidateStyleRegistryOptions = {
  profile?: WeChatCompatibilityProfile;
  policy?: FallbackVariantPolicy;
};

export type ValidateVariantDefinitionContext = {
  registry?: StyleRegistry;
  profile?: WeChatCompatibilityProfile;
  policy?: FallbackVariantPolicy;
};

export type ValidateResolvedArticleStyleContext = {
  profile?: WeChatCompatibilityProfile;
  policy?: FallbackVariantPolicy;
};

export type StyleRegistry = {
  schemaVersion: StyleSchemaVersion;
  themes: ThemeDefinition[];
  presets: PresetDefinition[];
  variants: VariantDefinition[];
};

/** InlineMark color 推荐输入：ColorTokenRef；legacy string 仅兼容 */
export type InlineMarkColorInput = ColorTokenRef | string;

export type ResolvedStyleSource =
  | "explicit"
  | "preset_default"
  | "registry_default"
  | "fallback";

export type StyleResolveIssue = {
  code: string;
  message: string;
  blockId?: string;
};

/** Resolved 层 token：theme + variant override，不含 inline style */
export type ResolvedStyleTokens = {
  theme: ThemeTokens;
  variant?: Record<string, string>;
};

export type ResolvedBlockStyle = {
  blockId: string;
  blockType: BlockType;
  variantId: string;
  variant: VariantDefinition;
  presetId: string;
  themeId: string;
  tokens: ResolvedStyleTokens;
  slots?: Record<string, SlotDefinition>;
  compatibility?: VariantCompatibility;
  source: ResolvedStyleSource;
  fallbackReason?: string;
};

export type ResolvedArticleStyle = {
  articleId: string;
  schemaVersion: StyleSchemaVersion;
  presetId: string;
  themeId: string;
  blocks: ResolvedBlockStyle[];
  issues?: StyleResolveIssue[];
};

export type StyleResolveContext = {
  registry: StyleRegistry;
  preset: PresetDefinition;
  theme: ThemeDefinition;
  presetId: string;
  themeId: string;
  blockOverride?: BlockStyleOverride;
  issues: StyleResolveIssue[];
};

export type ResolveArticleStyleOptions = {
  presetId?: string;
  themeId?: string;
  strict?: boolean;
};
