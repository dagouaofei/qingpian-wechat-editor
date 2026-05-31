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
  compatibility?: Record<string, string | number | boolean>;
  componentProtocol?: VariantComponentProtocol;
  metadata?: Record<string, string | number | boolean>;
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
  compatibility?: Record<string, string | number | boolean>;
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
