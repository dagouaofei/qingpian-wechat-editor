import { STYLE_SCHEMA_VERSION } from "@/core/styles/tokens";
import { weChatCompatibilityProfileSchema } from "@/core/styles/schemas";

import { WECHAT_SAFE_CONTRACT_VERSION_ID } from "./contract-version";
import type { DomStructureConstraints, WeChatSafeContractProfile } from "./wechat-compat-types";
import { buildContractV1CssRules } from "./wechat-css-classification";
import {
  WECHAT_CONTRACT_V1_CSS_FALLBACK_POLICIES,
  buildContractV1FallbackPolicy,
} from "./wechat-fallback-policy";
import { WECHAT_CONTRACT_V1_HTML_TAGS } from "./wechat-html-classification";
import { WECHAT_CONTRACT_V1_YELLOW_WAIVERS } from "./wechat-yellow-waivers";

export const WECHAT_CONTRACT_V1_DOM_CONSTRAINTS: DomStructureConstraints = {
  maxNestingDepth: 3,
  requireInlineStyle: true,
  requireTextNodeTypography: true,
  clipboardStripClassAttributes: true,
  forbidAdjacentSiblingSelectors: true,
  forbidEmptyWrapperStacking: true,
};

/** WeChatCompatibilityProfile.id — stable MP editor profile (Sprint 1-B / §1.3). */
export const WECHAT_MP_EDITOR_PROFILE_ID = "wechat-mp-editor-v1" as const;

const WECHAT_SAFE_CONTRACT_V1_PROFILE_BASE = {
  id: WECHAT_MP_EDITOR_PROFILE_ID,
  name: "WeChat MP Editor · WeChat-safe Contract v1",
  schemaVersion: STYLE_SCHEMA_VERSION,
  target: "wechat_mp_editor" as const,
  cssRules: buildContractV1CssRules(),
  fallbackPolicy: buildContractV1FallbackPolicy(),
  notes:
    "S8-STORY-003: profileId=wechat-mp-editor-v1; contractVersionId=wechat-safe-contract-v1. " +
    "CSS rules align Contract v1 (e.g. border-radius Yellow).",
};

weChatCompatibilityProfileSchema.parse(WECHAT_SAFE_CONTRACT_V1_PROFILE_BASE);

/**
 * Machine-readable WeChat-safe Contract v1 profile.
 * Maps Contract green/yellow/red → profile.cssRules allowed/risky/forbidden.
 */
export const WECHAT_SAFE_CONTRACT_V1_PROFILE: WeChatSafeContractProfile = {
  ...WECHAT_SAFE_CONTRACT_V1_PROFILE_BASE,
  contractVersionId: WECHAT_SAFE_CONTRACT_VERSION_ID,
  dom: WECHAT_CONTRACT_V1_DOM_CONSTRAINTS,
  htmlTags: WECHAT_CONTRACT_V1_HTML_TAGS,
  yellowWaivers: WECHAT_CONTRACT_V1_YELLOW_WAIVERS,
  cssFallbackPolicies: WECHAT_CONTRACT_V1_CSS_FALLBACK_POLICIES,
};

/** @deprecated Use WECHAT_MP_EDITOR_PROFILE_ID */
export const WECHAT_MP_EDITOR_V1_LEGACY_PROFILE_ID = WECHAT_MP_EDITOR_PROFILE_ID;

/** Default Release 1 compatibility profile (Contract v1 rules, MP profile id). */
export const WECHAT_MP_COMPATIBILITY_PROFILE_V1 = WECHAT_SAFE_CONTRACT_V1_PROFILE;
