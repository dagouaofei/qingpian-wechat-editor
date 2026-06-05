export {
  STYLE_LIBRARY_ID,
  STYLE_LIBRARY_SCHEMA_VERSION,
} from "./tokens";
export type { StyleLibrarySchemaVersion } from "./tokens";

export type {
  StyleLibraryAsset,
  StyleLibraryAssetType,
  StyleLibraryDistributionFlags,
  StyleLibraryEvidenceKind,
  StyleLibraryEvidenceRef,
  StyleLibraryLifecycleRef,
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
  StyleLibraryPaletteAsset,
  StyleLibraryPresetAsset,
  StyleLibraryRegistryPatch,
  StyleLibraryRegistryPatchOperation,
  StyleLibraryRuleAsset,
  StyleLibraryRuleKind,
  StyleLibrarySourceType,
  StyleLibraryValidationIssue,
  StyleLibraryValidationResult,
  StyleLibraryVariantAsset,
} from "./types";

export {
  STYLE_LIBRARY_ASSET_TYPES,
  STYLE_LIBRARY_EVIDENCE_KINDS,
  STYLE_LIBRARY_LIFECYCLE_STATES,
  STYLE_LIBRARY_REGISTRY_PATCH_OPERATIONS,
  STYLE_LIBRARY_RULE_KINDS,
  STYLE_LIBRARY_SOURCE_TYPES,
} from "./types";

export {
  styleLibraryAssetSchema,
  styleLibraryEvidenceRefSchema,
  styleLibraryLifecycleRefSchema,
  styleLibraryManifestSchema,
  styleLibraryPaletteAssetSchema,
  styleLibraryPresetAssetSchema,
  styleLibraryRegistryPatchSchema,
  styleLibraryRuleAssetSchema,
  styleLibraryVariantAssetSchema,
} from "./schemas";
export type { StyleLibraryManifestInput } from "./schemas";

export {
  STYLE_LIBRARY_EVIDENCE_REFS,
} from "./assets/evidence-refs";
export {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
  STYLE_LIBRARY_SEED_ASSET_IDS,
  STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS,
  STYLE_LIBRARY_SEED_VARIANT_ASSETS,
} from "./assets/seed-variant-assets";
export {
  SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH,
  STYLE_LIBRARY_SAMPLE_REGISTRY_PATCHES,
} from "./assets/sample-registry-patch";

export {
  STYLE_LIBRARY_LIFECYCLE_REFS,
  STYLE_LIBRARY_MANIFEST,
} from "./manifest";

export {
  validateAllStyleLibraryRegistryPatches,
  validateStyleLibraryRegistryPatch,
} from "./registry-patch";

export {
  LIFECYCLE_BLOCK_REASON_CODES,
  STYLE_LIBRARY_LIFECYCLE_ORDER,
  canTransitionLifecycle,
  createLifecycleChangeProposal,
  getAllowedLifecycleTransitions,
  getBlockedLifecycleTransitions,
  getLifecycleTransitionTargets,
  validateLifecycleTransition,
} from "./lifecycle";
export type {
  LifecycleChangeProposal,
  LifecycleDistributionImpact,
  LifecycleRuntimeImpact,
  LifecycleTransitionEvaluation,
  LifecycleTransitionOptions,
} from "./lifecycle";

export {
  LIFECYCLE_FORWARD_PATH,
  LIFECYCLE_PROMOTE_STORY,
  LIFECYCLE_VALIDATOR_STORY,
  isEvidenceGatedTransition,
  isPromoteTransition,
} from "./lifecycle-rules";

export {
  buildStyleLibraryInspectionTarget,
  createCandidatePreviewFixture,
  getStyleLibraryInspectionSummaries,
  getStyleLibraryInspectionSummary,
  renderStyleLibraryCandidateCopyHtml,
  renderStyleLibraryCandidatePreview,
  validateStyleLibraryCandidateCopyHtml,
} from "./inspection";
export {
  STYLE_LIBRARY_INSPECTION_CONTEXT,
  STYLE_LIBRARY_INSPECTION_PRESET_ID,
  createStyleLibraryInspectionStyleRegistry,
  getStyleLibraryInspectionFixture,
} from "./inspection-fixtures";
export type {
  PromoteReadiness,
  StyleLibraryCopyInspectionResult,
  StyleLibraryInspectionSummary,
  StyleLibraryInspectionTarget,
  StyleLibraryInspectionValidatorStatus,
  StyleLibraryPreviewInspectionResult,
  StyleLibraryValidatorInspectionResult,
} from "./inspection-result";

export {
  STYLE_LIBRARY_PALETTE_ASSETS,
  STYLE_LIBRARY_PALETTE_METADATA,
  PURPLE_CHAPTER_PALETTE_ASSET,
  READING_PATH_PALETTE_ASSET,
} from "./palette-assets";
export type { PaletteMetadata } from "./palette-assets";

export {
  STYLE_LIBRARY_RULE_ASSETS,
  STYLE_LIBRARY_RULE_METADATA,
  RULE_HARVEST_NOT_RELEASE1_ASSET,
  RULE_PASTE_QA_BEFORE_DEFAULT_ASSET,
  RULE_USER_SELECTABLE_NOT_DEFAULT_ASSET,
  RULE_WARNING_PROMOTE_WITH_EVIDENCE_ASSET,
} from "./rule-assets";
export type { RuleMetadata, RuleSeverity } from "./rule-assets";

export {
  CHAPTER_LABEL_STYLE,
  READING_PATH_STYLE,
  STYLE_LIBRARY_STYLE_DEFINITIONS,
} from "./style-assets";
export type { StyleDefinition, StyleLocalizedList, StyleLocalizedText } from "./style-assets";

export {
  buildStylePaletteRuleGraph,
  buildStylePaletteRuleSummaryCounts,
  buildVariantStyleAssociation,
  getPaletteMetadataById,
  getPalettesForVariantAssetId,
  getRuleMetadataById,
  getRulesForVariantAssetId,
  getStyleDefinitionById,
  getStyleForVariantAssetId,
  getStyleLibraryPaletteAssets,
  getStyleLibraryRuleAssets,
  getStyleLibraryStyleDefinitions,
  isRuleWithWarning,
  localizeList,
  localizeText,
} from "./style-palette-rule";
export type {
  StylePaletteRuleGraph,
  StylePaletteRuleSummaryCounts,
  VariantStyleAssociation,
} from "./style-palette-rule";

export {
  createHtmlCandidateProposal,
  validateHtmlCandidateProposal,
} from "./html-candidate-proposal";
export type {
  CreateHtmlCandidateProposalInput,
  HtmlCandidateEvidenceDraft,
  HtmlCandidateProposal,
  HtmlCandidateProposalInspection,
} from "./html-candidate-proposal";

export {
  extractStyleFeaturesFromHtml,
  hashSourceHtml,
  inferBlockTypeFromHtml,
  previewSourceHtml,
} from "./html-style-extractor";
export type {
  ExtractedStyleFeature,
  HtmlStyleExtractionResult,
} from "./html-style-extractor";

export {
  checkPromoteEligibility,
  createPromoteProposal,
  createUserSelectablePatchProposal,
  getPromoteBlockedReasons,
  validatePromoteProposal,
} from "./promote";
export {
  PROMOTE_BLOCK_REASON_CODES,
  PROMOTE_DEFAULT_ELIGIBLE_DECISION,
  PROMOTE_MIN_LIFECYCLE,
  PROMOTE_PROPOSAL_STORY,
  PROMOTE_PROPOSED_PATCH_PRESET_ID,
  PROMOTE_TARGET_LIFECYCLE,
} from "./promote-rules";
export type {
  PromoteDefaultPresetImpact,
  PromoteDistributionImpact,
  PromoteEligibilityResult,
  PromoteEligibilityStatus,
  PromotePasteQaStatus,
  PromotePatchPreview,
  PromoteProposal,
  PromoteRuntimeImpact,
} from "./promote-proposal";

export {
  StyleLibraryError,
  getStyleLibraryAssetById,
  getStyleLibrarySeedAssets,
  getStyleLibraryVariantAssets,
  parseStyleLibraryManifest,
  validateStyleLibraryManifest,
} from "./validation";
