export type {
  BlockTypeMismatchFallbackAction,
  ColorTokenRef,
  CompatibilityIssue,
  CopySafety,
  CssCompatibilityLevel,
  CssCompatibilityResult,
  Density,
  FallbackPolicy,
  FallbackVariantPolicy,
  ForbiddenCssFallbackAction,
  ForbiddenCssPolicyAction,
  InlineMarkColorInput,
  MissingVariantFallbackAction,
  PresetDefinition,
  ResolveArticleStyleOptions,
  ResolvedArticleStyle,
  ResolvedBlockStyle,
  ResolvedStyleSource,
  ResolvedStyleTokens,
  RiskyCssFallbackAction,
  RiskyCssPolicyAction,
  StyleRegistry,
  StyleResolveContext,
  StyleResolveIssue,
  StyleSchemaVersion,
  StyleValidationIssue,
  StyleValidationResult,
  StyleValidationSeverity,
  ThemeDefinition,
  ThemeTokenMap,
  ThemeTokens,
  TitleBlockLayoutCompatibility,
  TitleBlockLayoutCompatibilityTable,
  TitleBlockLayoutMode,
  TitleBlockLayoutRiskLevel,
  ValidateResolvedArticleStyleContext,
  ValidateStyleRegistryOptions,
  ValidateTitleBlockLayoutOptions,
  ValidateVariantDefinitionContext,
  VariantCompatibility,
  VariantComponentProtocol,
  VariantDefinition,
  SlotContentBinding,
  SlotContentBindingSource,
  SlotCopySafety,
  SlotDefinition,
  SlotRole,
  TitleBlockCatalogLayoutMapping,
  VariantStatus,
  VariantSlotDefinition,
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
  BODY_CONTENT_SLOT_ROLES,
  SLOT_CONTENT_BINDING_SOURCES,
  SLOT_ROLES,
  TITLE_BLOCK_COMPONENT_ID,
  TITLE_BLOCK_FIRST_WAVE_ALLOWED_LAYOUT_MODES,
  TITLE_BLOCK_LAYOUT_MODES,
} from "./types";

export {
  blockTypeMismatchFallbackActionSchema,
  colorTokenRefSchema,
  copySafetySchema,
  densitySchema,
  fallbackPolicySchema,
  fallbackVariantPolicySchema,
  forbiddenCssFallbackActionSchema,
  forbiddenCssPolicyActionSchema,
  inlineMarkColorInputSchema,
  missingVariantFallbackActionSchema,
  presetDefinitionSchema,
  riskyCssFallbackActionSchema,
  riskyCssPolicyActionSchema,
  slotContentBindingSchema,
  slotContentBindingSourceSchema,
  slotCopySafetySchema,
  slotDefinitionSchema,
  slotRoleSchema,
  styleRegistrySchema,
  styleSchemaVersionSchema,
  styleValidationIssueSchema,
  styleValidationResultSchema,
  styleValidationSeveritySchema,
  themeDefinitionSchema,
  themeTokensSchema,
  titleBlockLayoutCompatibilitySchema,
  titleBlockLayoutCompatibilityTableSchema,
  titleBlockLayoutModeSchema,
  titleBlockLayoutRiskLevelSchema,
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
  validateStyleRegistrySchema,
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

export {
  RELEASE1_FALLBACK_VARIANT_POLICY,
  buildStyleValidationResult,
  normalizeCopySafetyInput,
  parseFallbackVariantPolicy,
  parseStyleValidationResult,
  validateResolvedArticleStyle,
  validateStyleRegistry,
  validateVariantDefinition,
  validateVariantForWechatCopy,
  validateVariantSlots,
} from "./validation";

export {
  TITLE_BLOCK_CATALOG_LAYOUT_MODE_MAPPINGS,
  TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE,
  assertTitleBlockLayoutTableComplete,
  getFallbackTitleBlockLayoutMode,
  getTitleBlockLayoutCompatibility,
  isTitleBlockFirstWaveLayoutMode,
  isTitleBlockLayoutAllowedForCopy,
  isTitleBlockVariant,
  mapTitleBlockCatalogLayoutMode,
  normalizeTitleBlockLayoutMode,
  validateTitleBlockLayoutCompatibility,
} from "./title-layout";

export {
  CTA_FIRST_WAVE_VARIANTS,
  DIVIDER_FIRST_WAVE_VARIANTS,
  FIRST_WAVE_REQUIRED_VARIANT_COUNT_BY_BLOCK,
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  FIRST_WAVE_REQUIRED_VARIANTS,
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  HEADING_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  IMPLEMENTED_FIRST_WAVE_VARIANT_IDS,
  IMPLEMENTED_FIRST_WAVE_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STRUCTURED_BLOCK_VARIANT_IDS,
  STRUCTURED_BLOCK_VARIANT_REGISTRY,
  STRUCTURED_BLOCK_VARIANTS,
  TEXT_FIRST_BLOCK_VARIANT_IDS,
  TEXT_FIRST_BLOCK_VARIANT_REGISTRY,
  TEXT_FIRST_BLOCK_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS,
  TITLE_FIRST_WAVE_VARIANTS,
  createFirstWaveRequiredVariantRegistry,
} from "./variants";

export type {
  ArticleStylePlan,
  ArticleStylePlanOrchestratorHints,
  DecorationDensity,
  MergeStyleAssignmentPatchOptions,
  MergeStyleAssignmentPatchResult,
  StyleAssignmentPatch,
  StyleAssignmentPatchBlockOverride,
  StyleAssignmentSource,
  StyleAssignmentValidationMeta,
  StyleAssignmentValidationStatus,
  StyleSelectionArticleContext,
  StyleSelectionBlockStyleHint,
  StyleSelectionConstraints,
  StyleSelectionRequest,
} from "./style-assignment";

export {
  DECORATION_DENSITIES,
  STYLE_ASSIGNMENT_SOURCES,
  STYLE_ASSIGNMENT_VALIDATION_STATUSES,
} from "./style-assignment";

export {
  articleStylePlanOrchestratorHintsSchema,
  articleStylePlanSchema,
  blockStyleOverridePlanSchema,
  decorationDensitySchema,
  parseArticleStylePlan,
  parseStyleAssignmentPatch,
  parseStyleSelectionRequest,
  safeParseArticleStylePlan,
  safeParseStyleAssignmentPatch,
  safeParseStyleSelectionRequest,
  styleAssignmentPatchBlockOverrideSchema,
  styleAssignmentPatchSchema,
  styleAssignmentSourceSchema,
  styleAssignmentValidationMetaSchema,
  styleAssignmentValidationStatusSchema,
  styleSelectionArticleContextSchema,
  styleSelectionBlockStyleHintSchema,
  styleSelectionConstraintsSchema,
  styleSelectionRequestSchema,
} from "./style-assignment-schemas";

export type {
  ArticleStylePlanInput,
  StyleAssignmentPatchInput,
  StyleSelectionRequestInput,
} from "./style-assignment-schemas";

export {
  applyStyleAssignmentPatch,
  mergeStyleAssignmentPatch,
  patchToArticleStylePlan,
  styleAssignmentToArticleStylePlan,
} from "./style-assignment-patch";

export type {
  OrchestrateArticleStyleOptions,
  OrchestrateArticleStyleResult,
} from "./style-orchestrator";

export { orchestrateArticleStyle } from "./style-orchestrator";

export {
  ORCHESTRATOR_RULE_R1,
  ORCHESTRATOR_RULE_R2,
  ORCHESTRATOR_RULE_R8,
  applyOrchestratorRhythmRules,
  applyOrchestratorRuleR1,
  applyOrchestratorRuleR2,
  applyOrchestratorRuleR8,
} from "./style-orchestrator-rules";

export type { OrchestratorRuleId } from "./style-orchestrator-rules";

export {
  isOrchestratorCopySafeRequiredVariant,
  pickOrchestratorFallbackVariant,
  resolveOrchestratorBlockVariant,
  resolveOrchestratorPreset,
} from "./style-orchestrator-selection";

export type {
  OrchestratorBlockOverrideInput,
  OrchestratorBlockStyleState,
} from "./style-orchestrator-selection";
