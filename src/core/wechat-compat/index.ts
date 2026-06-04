export {
  WECHAT_SAFE_CONTRACT_VERSION_ID,
  type WeChatSafeContractVersionId,
} from "./contract-version";

export {
  CONTRACT_TO_CSS_LEVEL,
  type ContractCapabilityLevel,
  type ContractLevelToCssLevel,
  type CssClassificationContext,
  type CssFallbackPolicyEntry,
  type DomStructureConstraints,
  type HtmlTagClassification,
  type HtmlTagClassificationResult,
  type WaiverLookupResult,
  type WeChatSafeContractProfile,
  type YellowCapabilityWaiver,
} from "./wechat-compat-types";

export {
  COMPLEX_FLEX_AUXILIARY_PROPERTIES,
  WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS,
  WECHAT_CONTRACT_V1_GREEN_CSS,
  WECHAT_CONTRACT_V1_RED_CSS,
  WECHAT_CONTRACT_V1_YELLOW_CSS,
  buildContractV1CssRules,
  isComplexFlexDeclaration,
} from "./wechat-css-classification";

export {
  WECHAT_CONTRACT_V1_HTML_TAGS,
  classifyHtmlTag,
  isHtmlTagAllowedForCopy,
  listHtmlTagsByLevel,
} from "./wechat-html-classification";

export {
  HEADING_HIGHLIGHT_MARKER_WAIVER,
  WECHAT_CONTRACT_V1_YELLOW_WAIVERS,
  findYellowWaiverForCapability,
  findYellowWaiverForVariant,
  getWaiverFallbackPolicyId,
  isYellowCapabilityWaived,
  resolveWaiverFallbackDescription,
} from "./wechat-yellow-waivers";

export {
  WECHAT_CONTRACT_V1_CSS_FALLBACK_POLICIES,
  buildContractV1FallbackPolicy,
  getCssFallbackPolicyById,
} from "./wechat-fallback-policy";

export {
  WECHAT_CONTRACT_V1_DOM_CONSTRAINTS,
  WECHAT_MP_COMPATIBILITY_PROFILE_V1,
  WECHAT_MP_EDITOR_PROFILE_ID,
  WECHAT_MP_EDITOR_V1_LEGACY_PROFILE_ID,
  WECHAT_SAFE_CONTRACT_V1_PROFILE,
} from "./wechat-compat-profile";

export {
  WECHAT_COPY_ISSUE_CODES,
  validateWechatCopyHtml,
  type ValidateWechatCopyHtmlInput,
  type WechatCopyValidationIssue,
  type WechatCopyValidationResult,
  type WechatCopyValidationSeverity,
  type ContractIssueLevel,
} from "./copy-html-validator";

export type {
  FidelityMatrixBlockType,
  FidelityPasteStatus,
  FidelityValidatorStatus,
  FidelityVariantType,
  WechatFidelityFixtureSpec,
  WechatFidelityMatrixRow,
} from "./fidelity-matrix-types";

export { isListedHtmlTag } from "./wechat-html-classification";
