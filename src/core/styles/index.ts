export type {
  ColorTokenRef,
  CompatibilityIssue,
  CopySafety,
  CssCompatibilityLevel,
  CssCompatibilityResult,
  Density,
  FallbackPolicy,
  ForbiddenCssFallbackAction,
  InlineMarkColorInput,
  PresetDefinition,
  ResolveArticleStyleOptions,
  ResolvedArticleStyle,
  ResolvedBlockStyle,
  ResolvedStyleSource,
  ResolvedStyleTokens,
  RiskyCssFallbackAction,
  StyleRegistry,
  StyleResolveContext,
  StyleResolveIssue,
  StyleSchemaVersion,
  ThemeDefinition,
  ThemeTokenMap,
  ThemeTokens,
  VariantCompatibility,
  VariantComponentProtocol,
  VariantDefinition,
  VariantSlotDefinition,
  VariantStatus,
  VariantWeChatCompatibility,
  WeChatCompatibilityCheckResult,
  WeChatCompatibilityProfile,
  WeChatCompatibilityTarget,
  WeChatCssRules,
} from "./types";

export {
  COLOR_TOKEN_REFS,
  STYLE_SCHEMA_VERSION,
  isColorTokenRef,
  isLegacyRawColor,
  normalizeColorTokenRef,
} from "./tokens";

export {
  colorTokenRefSchema,
  copySafetySchema,
  densitySchema,
  fallbackPolicySchema,
  inlineMarkColorInputSchema,
  presetDefinitionSchema,
  styleRegistrySchema,
  styleSchemaVersionSchema,
  themeDefinitionSchema,
  themeTokensSchema,
  variantCompatibilitySchema,
  variantComponentProtocolSchema,
  variantDefinitionSchema,
  variantSlotDefinitionSchema,
  variantStatusSchema,
  variantWeChatCompatibilitySchema,
  weChatCompatibilityProfileSchema,
  weChatCompatibilityTargetSchema,
  weChatCssRulesSchema,
} from "./schemas";

export type {
  PresetDefinitionInput,
  StyleRegistryInput,
  ThemeDefinitionInput,
  VariantDefinitionInput,
  WeChatCompatibilityProfileInput,
} from "./schemas";

export {
  StyleRegistryError,
  getPresetById,
  getThemeById,
  getVariantById,
  getVariantsForBlockType,
  parseStyleRegistry,
  validateStyleRegistry,
} from "./registry";

export {
  StyleResolveError,
  resolveArticleStyle,
  resolveBlockStyle,
} from "./resolver";

export {
  WECHAT_MP_COMPATIBILITY_PROFILE,
  parseWeChatCompatibilityProfile,
  validateCssDeclarationCompatibility,
  validateCssPropertyCompatibility,
  validateVariantWechatCompatibility,
} from "./compatibility";
