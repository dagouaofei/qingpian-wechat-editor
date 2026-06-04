import type { BlockType } from "@/core/blocks/block.types";
import type {
  CssCompatibilityLevel,
  FallbackPolicy,
  WeChatCompatibilityProfile,
} from "@/core/styles/types";

import type { WeChatSafeContractVersionId } from "./contract-version";

/** Contract 文档分级 ↔ 代码 profile 字段 */
export type ContractCapabilityLevel = "green" | "yellow" | "red";

export type ContractLevelToCssLevel = {
  green: "allowed";
  yellow: "risky";
  red: "forbidden";
};

export const CONTRACT_TO_CSS_LEVEL: ContractLevelToCssLevel = {
  green: "allowed",
  yellow: "risky",
  red: "forbidden",
};

export type DomStructureConstraints = {
  maxNestingDepth: number;
  requireInlineStyle: boolean;
  requireTextNodeTypography: boolean;
  /** Clipboard payload must strip class; Preview/dev/test exempt */
  clipboardStripClassAttributes: boolean;
  forbidAdjacentSiblingSelectors: boolean;
  forbidEmptyWrapperStacking: boolean;
};

export type HtmlTagClassification = {
  tag: string;
  level: ContractCapabilityLevel;
  notes?: string;
};

export type CssFallbackPolicyEntry = {
  id: string;
  capability: string;
  fromLevel: "yellow";
  fallbackDescription: string;
  /** Declarations or strategies Copy Renderer may emit */
  fallbackTargets: string[];
};

export type YellowCapabilityWaiver = {
  evidenceId: string;
  contractVersionId: WeChatSafeContractVersionId;
  blockType: BlockType;
  variantId: string;
  cssCapabilities: string[];
  htmlDomContext: string;
  fallbackPolicyId: string;
  verifiedAt: string;
  matrixRowId?: string;
  allowedInDefaultPreset: boolean;
  waiverExpiresAt?: string;
  /** Must not extend gradient/box-decoration to other variants */
  nonTransferable: boolean;
  reason: string;
};

export type WeChatSafeContractProfile = WeChatCompatibilityProfile & {
  contractVersionId: WeChatSafeContractVersionId;
  dom: DomStructureConstraints;
  htmlTags: HtmlTagClassification[];
  yellowWaivers: YellowCapabilityWaiver[];
  cssFallbackPolicies: CssFallbackPolicyEntry[];
};

export type CssClassificationContext = {
  blockType?: BlockType;
  variantId?: string;
};

export type HtmlTagClassificationResult = {
  tag: string;
  level: ContractCapabilityLevel;
  cssLevel: CssCompatibilityLevel;
  notes?: string;
};

export type WaiverLookupResult = {
  waiver: YellowCapabilityWaiver;
  matchedCapability: string;
} | null;

export type { FallbackPolicy, WeChatCompatibilityProfile, CssCompatibilityLevel };
