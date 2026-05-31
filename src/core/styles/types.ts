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
  density?: Density;
  tone?: string;
};

export type VariantStatus =
  | "release1_required"
  | "release1_candidate"
  | "experimental";

export type VariantSlotDefinition = {
  id: string;
  label?: string;
};

export type VariantComponentProtocol = {
  componentId?: string;
  familyId?: string;
  layoutMode?: string;
};

export type CopySafety = "safe" | "risky" | "preview_only";

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
  slots?: Record<string, VariantSlotDefinition>;
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
  slots?: Record<string, VariantSlotDefinition>;
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
