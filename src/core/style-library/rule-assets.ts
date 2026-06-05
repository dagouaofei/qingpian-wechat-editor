import type { StyleLibraryRuleAsset, StyleLibraryRuleKind } from "./types";
import type { StyleLocalizedText } from "./style-assets";

const RULE_DISTRIBUTION = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
} as const;

export type RuleSeverity = "blocking" | "warning" | "info";

export type RuleMetadata = {
  ruleId: string;
  ruleType: StyleLibraryRuleKind;
  name: StyleLocalizedText;
  description: StyleLocalizedText;
  appliesTo: StyleLocalizedText;
  severity: RuleSeverity;
  relatedContract: string;
  operatorReadableSummary: StyleLocalizedText;
  linkedVariantAssetIds: string[];
  linkedStyleIds: string[];
  evidenceRefs: string[];
  relatedStory?: string;
};

export const RULE_PASTE_QA_BEFORE_DEFAULT_ASSET: StyleLibraryRuleAsset = {
  assetId: "rule-paste-qa-before-default",
  assetType: "rule",
  ruleId: "RULE_PASTE_QA_BEFORE_DEFAULT",
  ruleKind: "copy_safe",
  label: "Paste QA before default preset",
  description: "Default preset promotion requires Paste QA evidence",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...RULE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  refPath: "docs/architecture/style-library-promote-user-selectable.md",
  tags: ["copy_safe", "promote", "paste_qa"],
};

export const RULE_WARNING_PROMOTE_WITH_EVIDENCE_ASSET: StyleLibraryRuleAsset = {
  assetId: "rule-warning-promote-with-evidence",
  assetType: "rule",
  ruleId: "RULE_WARNING_PROMOTE_WITH_EVIDENCE",
  ruleKind: "copy_safe",
  label: "WARNING promote with evidence",
  description: "WARNING validator may enter promote review but must retain Paste QA evidence",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...RULE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  refPath: "docs/architecture/style-library-promote-user-selectable.md",
  tags: ["copy_safe", "promote", "warning"],
};

export const RULE_USER_SELECTABLE_NOT_DEFAULT_ASSET: StyleLibraryRuleAsset = {
  assetId: "rule-user-selectable-not-default",
  assetType: "rule",
  ruleId: "RULE_USER_SELECTABLE_NOT_DEFAULT",
  ruleKind: "selection",
  label: "User selectable is not default eligible",
  description: "user_selectable does not imply default_eligible or default preset",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...RULE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  refPath: "docs/architecture/style-library-promote-user-selectable.md",
  tags: ["selection", "promote", "distribution"],
};

export const RULE_HARVEST_NOT_RELEASE1_ASSET: StyleLibraryRuleAsset = {
  assetId: "rule-harvest-not-release1",
  assetType: "rule",
  ruleId: "RULE_HARVEST_NOT_RELEASE1",
  ruleKind: "selection",
  label: "Harvest candidate not release1_required",
  description: "Harvest candidates must not enter release1_required without PO decision",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...RULE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  refPath: "docs/architecture/style-library-storage.md",
  tags: ["selection", "harvest", "release1"],
};

export const STYLE_LIBRARY_RULE_ASSETS = [
  RULE_PASTE_QA_BEFORE_DEFAULT_ASSET,
  RULE_WARNING_PROMOTE_WITH_EVIDENCE_ASSET,
  RULE_USER_SELECTABLE_NOT_DEFAULT_ASSET,
  RULE_HARVEST_NOT_RELEASE1_ASSET,
] as const;

export const STYLE_LIBRARY_RULE_METADATA: Record<string, RuleMetadata> = {
  RULE_PASTE_QA_BEFORE_DEFAULT: {
    ruleId: "RULE_PASTE_QA_BEFORE_DEFAULT",
    ruleType: "copy_safe",
    name: {
      zh: "进入默认 preset 前必须通过 Paste QA",
      en: "Paste QA required before default preset",
    },
    description: {
      zh: "未通过 Paste QA 的 candidate 不得进入 default preset 或 default_eligible。",
      en: "Candidates without Paste QA must not enter default preset or default_eligible.",
    },
    appliesTo: {
      zh: "promote · default_eligible · default preset",
      en: "promote · default_eligible · default preset",
    },
    severity: "blocking",
    relatedContract: "style-library-promote-user-selectable",
    operatorReadableSummary: {
      zh: "没有 Paste QA 证据，不能进默认推荐。",
      en: "No Paste QA evidence — cannot enter default recommendation.",
    },
    linkedVariantAssetIds: [
      "seed-variant-heading-purple-chapter-label",
      "seed-variant-info-card-reading-path",
    ],
    linkedStyleIds: ["style-chapter-label", "style-reading-path"],
    evidenceRefs: ["PASTE-QA-SESSION-006D"],
    relatedStory: "S9-STORY-007",
  },
  RULE_WARNING_PROMOTE_WITH_EVIDENCE: {
    ruleId: "RULE_WARNING_PROMOTE_WITH_EVIDENCE",
    ruleType: "copy_safe",
    name: {
      zh: "WARNING 可进入 promote review 但必须保留证据",
      en: "WARNING may enter promote review but must retain evidence",
    },
    description: {
      zh: "validator WARNING 不是 FAIL；可审核上线，但不得删除 Paste QA 与兼容性提醒。",
      en: "Validator WARNING is not FAIL; promote review allowed but evidence must remain.",
    },
    appliesTo: {
      zh: "promote review · user_selectable proposal",
      en: "promote review · user_selectable proposal",
    },
    severity: "warning",
    relatedContract: "style-library-preview-copy-validator-integration",
    operatorReadableSummary: {
      zh: "有兼容性提醒，可审核上线，需保留 Paste QA 证据。",
      en: "Compatibility warnings present — promote review OK if Paste QA evidence retained.",
    },
    linkedVariantAssetIds: [
      "seed-variant-heading-purple-chapter-label",
      "seed-variant-info-card-reading-path",
    ],
    linkedStyleIds: ["style-chapter-label", "style-reading-path"],
    evidenceRefs: ["PASTE-QA-SESSION-006D", "S8M-HARVEST-001", "S8M-HARVEST-002"],
    relatedStory: "S9-STORY-007",
  },
  RULE_USER_SELECTABLE_NOT_DEFAULT: {
    ruleId: "RULE_USER_SELECTABLE_NOT_DEFAULT",
    ruleType: "selection",
    name: {
      zh: "user_selectable 不等于 default_eligible",
      en: "user_selectable does not mean default_eligible",
    },
    description: {
      zh: "进入用户可选池不代表进入 AI 默认选择或 default preset。",
      en: "User pool entry does not imply AI default selection or default preset.",
    },
    appliesTo: {
      zh: "distribution flags · promote · style selection",
      en: "distribution flags · promote · style selection",
    },
    severity: "info",
    relatedContract: "style-library-promote-user-selectable",
    operatorReadableSummary: {
      zh: "用户可选 ≠ 默认推荐；default 需单独 PO 决策。",
      en: "User selectable ≠ default recommendation; default needs separate PO decision.",
    },
    linkedVariantAssetIds: [
      "seed-variant-heading-purple-chapter-label",
      "seed-variant-info-card-reading-path",
    ],
    linkedStyleIds: [
      "style-chapter-label",
      "style-reading-path",
      "style-knowledge-editorial",
    ],
    evidenceRefs: [],
    relatedStory: "S9-STORY-007",
  },
  RULE_HARVEST_NOT_RELEASE1: {
    ruleId: "RULE_HARVEST_NOT_RELEASE1",
    ruleType: "selection",
    name: {
      zh: "harvest candidate 不得直接进入 release1_required",
      en: "Harvest candidates must not enter release1_required directly",
    },
    description: {
      zh: "006D harvest seed 仅用于治理与审查，不得标记为 Release 1 required variant。",
      en: "006D harvest seeds are governance-only and must not be release1_required.",
    },
    appliesTo: {
      zh: "harvest seed · distribution · runtime registry",
      en: "harvest seed · distribution · runtime registry",
    },
    severity: "blocking",
    relatedContract: "style-library-storage",
    operatorReadableSummary: {
      zh: "Harvest 候选不能自动成为 Release 1 必带样式。",
      en: "Harvest candidates cannot auto-become Release 1 required variants.",
    },
    linkedVariantAssetIds: [
      "seed-variant-heading-purple-chapter-label",
      "seed-variant-info-card-reading-path",
    ],
    linkedStyleIds: [
      "style-chapter-label",
      "style-reading-path",
      "style-business-professional",
    ],
    evidenceRefs: ["WX-HARVEST-EVIDENCE-001"],
    relatedStory: "S9-STORY-002",
  },
};
